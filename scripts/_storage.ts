/**
 * Shared Supabase Storage upload helper for asset-generation scripts.
 *
 * Architecture (per skill/references/asset-hosting.md):
 *
 *   Image gen / video gen / frame extract → uploads to Supabase Storage
 *     bucket: site-assets (public-read)
 *     path  : {projectId}/{kind}/{slot}.{ext}
 *     URL   : https://{ref}.supabase.co/storage/v1/object/public/site-assets/{path}
 *
 * Each script ALSO maintains content/asset-manifest.json mapping slot → URL.
 * The agent reads that manifest at scaffold time and writes the URLs into
 * lib/site-config.ts (services[i].imageUrl, hero.backgroundImage, etc),
 * so the generated site uses CDN URLs and the build dir / git stays small.
 *
 * Required env (passed through by skillAgent.ts buildScrubbedEnv when the
 * command matches gen:images|gen:videos|gen:frames|gen:all|generate-*):
 *
 *   SUPABASE_URL              — platform Supabase (DB1)
 *   SUPABASE_SERVICE_KEY      — service-role key (server-side only)
 *   KODAGEN_PROJECT_ID        — UUID, used as the per-project folder prefix
 *   KODAGEN_ASSETS_BUCKET     — defaults to "site-assets"
 *
 * Behavior when creds are missing: returns null so callers can fall back to
 * writing locally to public/ (legacy path). This keeps the scripts usable
 * outside the kodagen pipeline.
 */
import { readFile, writeFile, stat, mkdir } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { existsSync } from "node:fs";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";
const PROJECT_ID = process.env.KODAGEN_PROJECT_ID ?? "";
const BUCKET = process.env.KODAGEN_ASSETS_BUCKET ?? "site-assets";

export function storageReady(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_KEY && PROJECT_ID);
}

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function ref(): string {
  return new URL(SUPABASE_URL).hostname.split(".")[0];
}

/**
 * Upload a single asset to Storage. `relKey` is the path WITHIN the project's
 * folder, e.g. "images/service-design-build.jpg" or "frames/scene-1/0001.jpg".
 *
 * Returns the public CDN URL, or null if Storage isn't configured (caller
 * should fall back to local writeFile in that case).
 */
export async function uploadAsset(localPath: string, relKey: string): Promise<string | null> {
  if (!storageReady()) return null;
  const body = await readFile(localPath);
  const ext = extname(relKey).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const fullKey = `${PROJECT_ID}/${relKey}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fullKey}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY,
      "Content-Type": contentType,
      // Idempotent — same slug overwrites cleanly across retries.
      "x-upsert": "true",
      // Long-cache: generated assets don't change after upload, so 1 year
      // immutable is safe. Re-runs upload to a different path or upsert.
      "cache-control": "public, max-age=31536000, immutable",
    },
    body,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage upload failed [${res.status}] ${fullKey}: ${err.slice(0, 200)}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fullKey}`;
}

/**
 * Upload a Buffer/Uint8Array directly (saves the writeFile→readFile round-trip
 * when the script already has the bytes in memory, e.g. fresh from Gemini).
 */
export async function uploadBytes(bytes: Buffer | Uint8Array, relKey: string): Promise<string | null> {
  if (!storageReady()) return null;
  const ext = extname(relKey).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";
  const fullKey = `${PROJECT_ID}/${relKey}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fullKey}`;
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      apikey: SUPABASE_SERVICE_KEY,
      "Content-Type": contentType,
      "x-upsert": "true",
      "cache-control": "public, max-age=31536000, immutable",
    },
    body: bytes as BodyInit,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage upload failed [${res.status}] ${fullKey}: ${err.slice(0, 200)}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fullKey}`;
}

// ── Manifest helpers ─────────────────────────────────────

const MANIFEST_PATH = "content/asset-manifest.json";

export type AssetManifest = {
  bucket: string;
  projectId: string;
  ref: string;
  images: Record<string, string>; // slot → URL
  videos: Record<string, string>;
  frames: Record<string, string[]>; // sceneId → frame URLs in order
  updatedAt: string;
};

async function readManifest(): Promise<AssetManifest> {
  if (!existsSync(MANIFEST_PATH)) {
    return {
      bucket: BUCKET,
      projectId: PROJECT_ID,
      ref: SUPABASE_URL ? ref() : "",
      images: {},
      videos: {},
      frames: {},
      updatedAt: new Date().toISOString(),
    };
  }
  const raw = await readFile(MANIFEST_PATH, "utf8");
  return JSON.parse(raw) as AssetManifest;
}

async function writeManifest(m: AssetManifest): Promise<void> {
  m.updatedAt = new Date().toISOString();
  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(m, null, 2));
}

export async function recordImage(slot: string, url: string): Promise<void> {
  const m = await readManifest();
  m.images[slot] = url;
  await writeManifest(m);
}

export async function recordVideo(slot: string, url: string): Promise<void> {
  const m = await readManifest();
  m.videos[slot] = url;
  await writeManifest(m);
}

export async function recordFrames(sceneId: string, urls: string[]): Promise<void> {
  const m = await readManifest();
  m.frames[sceneId] = urls;
  await writeManifest(m);
}
