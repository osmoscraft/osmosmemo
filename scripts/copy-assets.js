import assert from "assert/strict";
import fs from "fs/promises";
import { copyDir } from "./fs.js";

assert(process.argv.includes("--src"), "Specify src dir: --src <SOURCE_DIR>");
assert(process.argv.includes("--target"), "Specify target dir: --target <TARGET_DIR>");

const isWatch = process.argv.includes("--watch");
const srcDir = process.argv[process.argv.indexOf("--src") + 1];
const targetDir = process.argv[process.argv.indexOf("--target") + 1];

/**
 * @param {string} srcDir
 * @param {string} targetDir
 * @param {boolean} isWatch
 */
async function copyFilesOnChangeRecursive(srcDir, targetDir, isWatch) {
  const { targetPaths } = await copyDir(srcDir, targetDir);
  console.log(`[copy-assets] Copied ${targetPaths.length} files`);

  if (!isWatch) return;

  const ac = new AbortController();
  const { signal } = ac;
  const changeStream = fs.watch(srcDir, { recursive: false, signal });

  try {
    for await (const _change of changeStream) {
      ac.abort();
      copyFilesOnChangeRecursive(srcDir, targetDir, isWatch);
    }
  } catch {
    // ignore the error that abort throws
  }
}

copyFilesOnChangeRecursive(srcDir, targetDir, isWatch);
