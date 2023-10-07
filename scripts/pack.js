import assert from "assert/strict";
import { exec } from "child_process";
import { readFile } from "fs/promises";
import path from "path";
import { promisify } from "util";
import { readJson } from "./fs.js";

const execAsync = promisify(exec);

assert(process.argv.includes("--dir"), "Specify dir to be packed: --dir <DIR>");
const dir = process.argv[process.argv.indexOf("--dir") + 1];

/**
 * @param {string} dir
 */
async function pack(dir) {
  console.log("[pack] extension dir", path.resolve(dir));
  const manifest = await readJson(path.resolve(dir, "manifest.json"));
  const version = manifest.version;
  const packageName = await readFile("package.json", "utf-8")
    .then(JSON.parse)
    .then((pkg) => pkg.name);

  const outFilename = `${packageName}-${version}.chrome.zip`;

  await execAsync(`zip -r ../${outFilename} .`, { cwd: dir });

  console.log(`[pack] packed: ${outFilename}`);
}

pack(dir);
