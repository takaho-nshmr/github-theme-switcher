const { spawn } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const esbuild = require("esbuild");

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

async function cleanDist() {
  await fs.rm(distDir, { recursive: true, force: true });
}

async function ensureDist() {
  await fs.mkdir(distDir, { recursive: true });
}

function runTypeCheck() {
  const tscBinary =
    process.platform === "win32"
      ? path.join(rootDir, "node_modules", ".bin", "tsc.cmd")
      : path.join(rootDir, "node_modules", ".bin", "tsc");

  return new Promise((resolve, reject) => {
    const tsc = spawn(tscBinary, ["--noEmit"], {
      stdio: "inherit",
    });

    tsc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`tsc exited with code ${code}`));
      }
    });

    tsc.on("error", (error) => reject(error));
  });
}

async function bundleScripts() {
  await esbuild.build({
    entryPoints: [
      path.join(rootDir, "src", "contentScript.ts"),
      path.join(rootDir, "src", "popup", "index.ts"),
    ],
    outbase: path.join(rootDir, "src"),
    outdir: distDir,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["chrome114"],
    sourcemap: false,
    logLevel: "info",
  });
}

async function copyPublicAssets() {
  await fs.cp(publicDir, distDir, { recursive: true });
}

(async () => {
  try {
    await cleanDist();
    await ensureDist();
    await runTypeCheck();
    await bundleScripts();
    await copyPublicAssets();
    console.log("Build completed.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
})();
