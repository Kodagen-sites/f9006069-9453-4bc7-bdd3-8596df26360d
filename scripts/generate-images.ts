/**
 * generate-images.ts (kodagen platform CLIENT — CANONICAL, DO NOT REWRITE)
 *
 * ⚠ THIS SCRIPT IS COMPLETE. DO NOT REPLACE IT. ⚠
 *
 * It already does what every "let me rewrite this to use the platform
 * endpoint" attempt produces. It POSTs to /api/asset/image, polls nothing
 * (image is synchronous), gets back a CDN URL, writes it to
 * content/asset-manifest.json. The platform handles Gemini auth, Vertex
 * vs AI Studio fallback, retries, Storage upload, and billing.
 *
 * If `npm run gen:images` fails on first try:
 *   1. npm install probably still finishing — wait 30s and retry
 *   2. KODAGEN_* env vars not injected yet — wait 5s and retry
 *   3. 429 from Gemini quota — top up credits at AI Studio; do NOT rewrite
 *
 * Rewriting this file is a known-failure mode: it costs ~$2-3 in wasted
 * iterations and produces an equivalent script. Trust this one and retry.
 *
 * Inputs:
 *   prompts/scene-N/start.txt, end.txt   (scene keyframes)
 *   prompts/section-*.txt                (section images)
 *   prompts/service-*.txt                (service-card images)
 *
 * Output:
 *   content/asset-manifest.json — { images: { slot: cdnUrl } }
 *
 * Env (injected by Kodagen runtime):
 *   KODAGEN_ASSET_API_URL   required
 *   KODAGEN_PROJECT_ID      required
 *   KODAGEN_BUILD_TOKEN     required (JWT)
 *   IMAGE_CONCURRENCY       optional, default 4
 *   IMAGE_MAX_RETRIES       optional, default 3
 */

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const API_URL = process.env.KODAGEN_ASSET_API_URL!;
const TOKEN = process.env.KODAGEN_BUILD_TOKEN!;
const PROJECT_ID = process.env.KODAGEN_PROJECT_ID!;
const CONCURRENCY = parseInt(process.env.IMAGE_CONCURRENCY ?? "4", 10);
const MAX_RETRIES = parseInt(process.env.IMAGE_MAX_RETRIES ?? "3", 10);
const MANIFEST = "content/asset-manifest.json";

if (!API_URL || !TOKEN || !PROJECT_ID) {
  // Soft fail — env vars are normally injected by the Kodagen runtime.
  // If they're missing, the runtime probably hasn't finished setup yet.
  // Exit 75 (EX_TEMPFAIL) so the agent knows to retry, not rewrite.
  console.error("✗ KODAGEN_ASSET_API_URL / KODAGEN_BUILD_TOKEN / KODAGEN_PROJECT_ID not set yet — retry in 5s.");
  process.exit(75);
}

interface Manifest {
  bucket: string;
  projectId: string;
  ref: string;
  images: Record<string, string>;
  videos: Record<string, string>;
  frames: Record<string, string[]>;
  updatedAt: string;
}

async function readManifest(): Promise<Manifest> {
  if (!existsSync(MANIFEST)) {
    return {
      bucket: "site-assets",
      projectId: PROJECT_ID,
      ref: "",
      images: {},
      videos: {},
      frames: {},
      updatedAt: new Date().toISOString(),
    };
  }
  return JSON.parse(await readFile(MANIFEST, "utf8")) as Manifest;
}

async function writeManifest(m: Manifest): Promise<void> {
  m.updatedAt = new Date().toISOString();
  await mkdir("content", { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(m, null, 2));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface ImageResp { url: string; bytes?: number; costCents?: number; model?: string; provider?: string }

async function generateImage(prompt: string, slot: string, aspect = "16:9"): Promise<ImageResp> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_URL}/api/asset/image`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ projectId: PROJECT_ID, slot, prompt, aspect }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = (await res.json()) as ImageResp;
      if (!data.url) throw new Error("no url in response");
      return data;
    } catch (err: any) {
      lastErr = err;
      const msg = String(err?.message ?? err);
      // SAFETY blocks are not retryable; quota exhaustion is also terminal
      // within the build (would need new credits, not a retry).
      const terminal = /SAFETY|PROHIBITED_CONTENT|RESOURCE_EXHAUSTED|credits\s+are\s+depleted/i.test(msg);
      if (terminal || attempt === MAX_RETRIES) break;
      await sleep(2000 * attempt);
    }
  }
  throw lastErr;
}

interface Job { promptPath: string; slot: string; label: string }

async function collectJobs(): Promise<Job[]> {
  const jobs: Job[] = [];
  if (!existsSync("prompts")) return jobs;
  const entries = await readdir("prompts");

  for (const d of entries.filter((d) => /^scene-\d+$/.test(d)).sort()) {
    for (const frameType of ["start", "end"] as const) {
      const p = join("prompts", d, `${frameType}.txt`);
      if (existsSync(p)) {
        jobs.push({ promptPath: p, slot: `${d}-${frameType}`, label: `${d}/${frameType}` });
      }
    }
  }
  for (const f of entries.filter((f) => (f.startsWith("section-") || f.startsWith("service-") || f === "og-image.txt") && f.endsWith(".txt"))) {
    const base = f.replace(/\.txt$/, "");
    jobs.push({ promptPath: join("prompts", f), slot: base, label: base });
  }
  return jobs;
}

async function main() {
  console.log("\n🎨 Image Generation (platform client → Vertex/Gemini)");
  console.log(`   Concurrency: ${CONCURRENCY}\n`);

  const manifest = await readManifest();
  const jobs = await collectJobs();
  if (jobs.length === 0) {
    console.log("No prompts found.");
    return;
  }

  const remaining = jobs.filter((j) => !manifest.images[j.slot]);
  const skipped = jobs.length - remaining.length;
  console.log(`Found ${jobs.length}; ${skipped} already in manifest; ${remaining.length} to generate.\n`);

  let nextIdx = 0;
  let done = 0;
  let failed = 0;
  let spendCents = 0;

  async function worker(): Promise<void> {
    while (true) {
      const i = nextIdx++;
      if (i >= remaining.length) return;
      const job = remaining[i];
      const prompt = (await readFile(job.promptPath, "utf-8")).trim();
      try {
        const r = await generateImage(prompt, job.slot);
        manifest.images[job.slot] = r.url;
        spendCents += r.costCents ?? 0;
        // Persist after each success so a crash mid-run keeps partial progress.
        await writeManifest(manifest);
        done++;
        console.log(`✓ [${done + skipped}/${jobs.length}] ${job.label}${r.costCents ? `  $${(r.costCents / 100).toFixed(2)}` : ""}`);
      } catch (err: any) {
        failed++;
        console.error(`✗ ${job.label} — ${err.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(`\nDone. Generated ${done}, skipped ${skipped}, failed ${failed}.`);
  if (spendCents > 0) console.log(`Spend: $${(spendCents / 100).toFixed(2)}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
