const { promisify } = require("util");
const path = require("path");
const { exec } = require("child_process");

const UNPACKED_OUT_DIR = `dist/unpacked`;

const execAsync = promisify(exec);

async function pack() {
  const manifest = require(path.resolve(UNPACKED_OUT_DIR, "manifest.json"));
  const version = manifest.version;
  await execAsync(`zip -r ../osmosmemo-${version}.zip .`, {cwd: UNPACKED_OUT_DIR})
}

pack();