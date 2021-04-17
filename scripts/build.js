const path = require("path");
const fs = require("fs-extra");

async function build() {

  
  console.log("[build] start building extension...");
  
  console.log("[build] remove dist");
  fs.removeSync(path.resolve("dist"));
  
  await require("esbuild")
  .build({
    entryPoints: [
      "src/content-script.ts",
      "src/popup/popup.ts",
      "src/options/options.ts",
    ],
    bundle: true,
    format: "esm",
    outdir: "dist",
  })
  .catch(() => process.exit(1));


  const copyTasksAsync = [ 
    fs.copyFile(path.resolve("src/options.html"), path.resolve("dist/options.html")),
    fs.copyFile(path.resolve("src/popup.html"), path.resolve("dist/popup.html")),
    fs.copyFile(path.resolve("src/manifest.json"), path.resolve("dist/manifest.json")),
    fs.copyFile(path.resolve("src/styles.css"), path.resolve("dist/styles.css")),
    fs.copy(path.resolve("src/assets"), path.resolve("dist/assets")),
  ];

  await Promise.all(copyTasksAsync);
}


build();