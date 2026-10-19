/**
 * GitHub Pages uses `output: "export"`, which cannot include App Router
 * route handlers. Temporarily move `app/api` aside for the static build.
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const apiDir = join(root, "app", "api");
const tmpDir = join(root, ".tmp-api-excluded");

function stashApi() {
  if (existsSync(tmpDir)) {
    rmSync(tmpDir, { recursive: true, force: true });
  }
  if (!existsSync(apiDir)) return;
  cpSync(apiDir, tmpDir, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
}

function restoreApi() {
  if (!existsSync(tmpDir)) return;
  if (existsSync(apiDir)) {
    rmSync(apiDir, { recursive: true, force: true });
  }
  cpSync(tmpDir, apiDir, { recursive: true });
  rmSync(tmpDir, { recursive: true, force: true });
}

let exitCode = 1;

try {
  stashApi();
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      STATIC_EXPORT: "true",
    },
  });
  exitCode = result.status ?? 1;
} finally {
  restoreApi();
}

process.exit(exitCode);
