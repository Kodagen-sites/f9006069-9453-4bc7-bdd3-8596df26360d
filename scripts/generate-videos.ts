/**
 * generate-videos.ts (kodagen platform CLIENT — CANONICAL, DO NOT REWRITE)
 *
 * ⚠ THIS SCRIPT IS COMPLETE. DO NOT REPLACE IT. ⚠
 *
 * It already POSTs to /api/asset/video, polls /api/asset/video?operation=…
 * until done, writes URLs to content/asset-manifest.json, AND downloads
 * each clip to raw/scene-N.mp4 so gen:stitch + gen:frames have something
 * to extract from. The platform handles Veo auth, Vertex/AI-Studio
 * fallback, Storage upload, and billing.
 *
 * If `npm run gen:videos` fails on first try:
 *   1. gen:images may not have completed — verify content/asset-manifest.json
 *      has scene-N-start / scene-N-end image URLs, then retry
 *   2. KODAGEN_* env vars not injected yet — wait 5s and retry
 *   3. 429 from Veo quota — top up credits at AI Studio; do NOT rewrite
 *
 * Rewriting this script is a known-failure mode — it costs ~$2-3 in
 * wasted iterations and produces an equivalent file. Trust this one.
 *
 * Inputs:
 *   prompts/scene-N/motion.txt          (Veo motion prompt)
 *   content/asset-manifest.json.images  (start/end frame CDN URLs)
 *
 * Output:
 *   content/asset-manifest.json — { videos: { scene-N: cdnUrl } }
 *   raw/scene-N.mp4              — local copy for stitch/frames
 *
 * Env (injected by Kodagen runtime):
 *   KODAGEN_ASSET_API_URL    required
 *   KODAGEN_PROJECT_ID       required
 *   KODAGEN_BUILD_TOKEN      required (JWT)
 *   VEO_CONCURRENCY          optional, default 3
 *   VEO_POLL_MS              optional, default 8000
 *   VEO_MAX_POLL_MIN         optional, default 10
 *   VEO_MAX_RETRIES          optional, default 2
 */

import { readFile, writeFile, readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const API_URL = process.env.KODAGEN_ASSET_API_URL!;
const TOKEN = process.env.KODAGEN_BUILD_TOKEN!;
const PROJECT_ID = process.env.KODAGEN_PROJECT_ID!;
const CONCURRENCY = Math.max(1, parseInt(process.env.VEO_CONCURRENCY ?? "3", 10));
const POLL_MS = parseInt(process.env.VEO_POLL_MS ?? "8000", 10);
const MAX_POLL_MIN = parseInt(process.env.VEO_MAX_POLL_MIN ?? "10", 10);
const MAX_RETRIES = parseInt(process.env.VEO_MAX_RETRIES ?? "2", 10);
const DURATION = parseInt(process.env.VEO_DURATION_SECONDS ?? "8", 10);
const MANIFEST = "content/asset-manifest.json";

if (!API_URL || !TOKEN || !PROJECT_ID) {
  console.error("✗ KODAGEN_ASSET_API_URL / KODAGEN_BUILD_TOKEN / KODAGEN_PROJECT_ID not set yet — retry in 5s.");
  process.exit(75);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

async function fileExists(p: string): Promise<boolean> {
  try { await stat(p); return true; } catch { return false; }
}

interface StartResp { operationId: string; provider?: string; model?: string }
interface PollResp { done: boolean; url?: string; bytes?: number; costCents?: number; error?: string; detail?: string }

async function startVideo(opts: { prompt: string; slot: string; startFrameUrl?: string; endFrameUrl?: string }): Promise<StartResp> {
  const res = await fetch(`${API_URL}/api/asset/video`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ ...opts, projectId: PROJECT_ID, durationSeconds: DURATION }),
  });
  if (!res.ok) throw new Error(`start HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as StartResp;
  if (!data.operationId) throw new Error("no operationId in response");
  return data;
}

async function pollVideo(operationId: string, slot: string): Promise<PollResp> {
  const deadline = Date.now() + MAX_POLL_MIN * 60_000;
  const url = `${API_URL}/api/asset/video?operation=${encodeURIComponent(operationId)}&projectId=${encodeURIComponent(PROJECT_ID)}&slot=${encodeURIComponent(slot)}`;
  let tick = 0;
  while (Date.now() < deadline) {
    await sleep(POLL_MS);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const body = (await res.json()) as PollResp;
    if (!res.ok && res.status !== 200) {
      console.warn(`  poll HTTP ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
      continue;
    }
    tick++;
    process.stdout.write(`.`);
    if (tick % 12 === 0) process.stdout.write(` (${(tick * POLL_MS) / 1000}s)`);
    if (body.error) throw new Error(`Veo error: ${body.error}${body.detail ? `: ${body.detail}` : ""}`);
    if (body.done) {
      process.stdout.write("\n");
      if (!body.url) throw new Error("done but no url");
      return body;
    }
  }
  throw new Error(`timeout after ${MAX_POLL_MIN} min`);
}

// Download the generated mp4 to raw/scene-N.mp4. Without the local copy,
// gen:stitch + gen:frames have nothing to extract from and the scroll-
// canvas hero ships empty.
async function downloadToRaw(url: string, slot: string): Promise<void> {
  await mkdir("raw", { recursive: true });
  const r = await fetch(url);
  if (!r.ok) throw new Error(`download HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await writeFile(join("raw", `${slot}.mp4`), buf);
  console.log(`  ↓ raw/${slot}.mp4 (${(buf.length / 1024).toFixed(0)} KB)`);
}

interface Scene { id: string; motionPrompt: string; startUrl?: string; endUrl?: string }

async function collectScenes(manifest: Manifest): Promise<Scene[]> {
  if (!existsSync("prompts")) return [];
  const dirs = await readdir("prompts");
  const out: Scene[] = [];
  for (const name of dirs.sort()) {
    if (!/^scene-\d+$/.test(name)) continue;
    const motionPath = join("prompts", name, "motion.txt");
    if (!existsSync(motionPath)) continue;
    out.push({
      id: name,
      motionPrompt: (await readFile(motionPath, "utf8")).trim(),
      startUrl: manifest.images[`${name}-start`],
      endUrl: manifest.images[`${name}-end`],
    });
  }
  return out;
}

async function processScene(scene: Scene): Promise<{ ok: boolean; url?: string; costCents: number; err?: string }> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const started = await startVideo({
        prompt: scene.motionPrompt,
        slot: scene.id,
        startFrameUrl: scene.startUrl,
        endFrameUrl: scene.endUrl,
      });
      console.log(`→ ${scene.id} queued${started.provider ? ` (${started.provider}/${started.model})` : ""}`);
      process.stdout.write(`  polling`);
      const final = await pollVideo(started.operationId, scene.id);
      console.log(`✓ ${scene.id}  $${((final.costCents ?? 0) / 100).toFixed(2)}`);
      await downloadToRaw(final.url!, scene.id);
      return { ok: true, url: final.url!, costCents: final.costCents ?? 0 };
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (attempt === MAX_RETRIES) return { ok: false, costCents: 0, err: msg };
      await sleep(15_000 * attempt);
    }
  }
  return { ok: false, costCents: 0, err: "unreachable" };
}

async function main() {
  console.log("\n🎬 Video Generation (platform client → Vertex/Veo)\n");
  const manifest = await readManifest();
  const scenes = await collectScenes(manifest);
  if (scenes.length === 0) {
    console.log("No scenes found.");
    return;
  }
  console.log(`Found ${scenes.length} scene${scenes.length === 1 ? "" : "s"} (concurrency=${CONCURRENCY})\n`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;
  let spendCents = 0;

  for (let i = 0; i < scenes.length; i += CONCURRENCY) {
    const batch = scenes.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (scene) => {
      if (manifest.videos[scene.id]) {
        // Manifest has the URL — skip the API call but ensure raw/ has
        // the local copy (gen:stitch needs it; raw/ is git-ignored).
        if (!(await fileExists(join("raw", `${scene.id}.mp4`)))) {
          try { await downloadToRaw(manifest.videos[scene.id], scene.id); }
          catch (err: any) { console.warn(`re-download ${scene.id}: ${err?.message ?? err}`); }
        }
        skipped++;
        console.log(`⏭  ${scene.id} already in manifest`);
        return;
      }
      const r = await processScene(scene);
      if (r.ok && r.url) {
        manifest.videos[scene.id] = r.url;
        spendCents += r.costCents;
        generated++;
        await writeManifest(manifest);
      } else {
        failed++;
        console.error(`✗ ${scene.id} — ${r.err}`);
      }
    }));
  }

  console.log("---");
  console.log(`Generated ${generated}, skipped ${skipped}, failed ${failed}.`);
  if (spendCents > 0) console.log(`Spend: $${(spendCents / 100).toFixed(2)}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
