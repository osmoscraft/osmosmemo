const { promisify } = require("util");
const path = require("path");
const { exec } = require("child_process");

const UNPACKED_OUT_DIR = `dist/unpacked`;

const execAsync = promisify(exec);

async function pack() {
  const manifest = require(path.resolve(UNPACKED_OUT_DIR, "manifest.json"));
  const version = manifest.version;
  const outFilename = `osmosmemo-${version}.zip`;
  await execAsync(`zip -r ../${outFilename} .`, {cwd: UNPACKED_OUT_DIR})

  console.log(`[pack] packed: ${outFilename}`);
}

pack();