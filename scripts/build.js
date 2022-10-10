const path = require("path");
const fs = require("fs-extra");

const OUT_DIR = `dist`;
const UNPACKED_OUT_DIR = `dist/unpacked`;

const isDevMode = process.argv.includes("--dev");

async function build() {
  console.log("[build] start building extension...");

  console.log(`[build] remove ${OUT_DIR}`);
  fs.removeSync(path.resolve(OUT_DIR));

  await require("esbuild")
    .build({
      entryPoints: ["src/content-script.ts", "src/popup/popup.ts", "src/options/options.ts"],
      bundle: true,
      format: "esm",
      outdir: UNPACKED_OUT_DIR,
      watch: isDevMode
        ? {
            onRebuild: (error) => {
              if (error) {
                console.error(`[watch] rebuild error`, error);
              } else {
                console.log(`[watch] rebuild success`);
              }
            },
          }
        : false,
    })
    .catch(() => process.exit(1));

  const copyTasksAsync = [
    fs.copyFile(path.resolve("src/options.html"), path.join(UNPACKED_OUT_DIR, "options.html")),
    fs.copyFile(path.resolve("src/popup.html"), path.join(UNPACKED_OUT_DIR, "popup.html")),
    fs.copyFile(path.resolve("src/manifest.json"), path.join(UNPACKED_OUT_DIR, "manifest.json")),
    fs.copyFile(path.resolve("src/styles.css"), path.join(UNPACKED_OUT_DIR, "styles.css")),
    fs.copy(path.resolve("src/assets"), path.join(UNPACKED_OUT_DIR, "assets")),
  ];

  await Promise.all(copyTasksAsync);
  console.log("[build] assets copied");
}

build();
