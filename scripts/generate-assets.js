const fs = require("fs");
const path = require("path");

const BASE_URL =
  "https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master";

const ROOT = path.join(__dirname, "..");

const folders = {
  icons: "ICONS",
  images: "IMAGES",
  fonts: "FONTS",
};

function generateAsset(folder, name) {
  const dir = path.join(ROOT, folder);

  if (!fs.existsSync(dir)) {
    console.log(`⚠️ Folder "${folder}" tidak ditemukan, skip.`);
    return;
  }

  // filter: skip .DS_Store & hidden files
  const files = fs
    .readdirSync(dir)
    .filter((file) => !file.startsWith(".") && !file.endsWith(".DS_Store"));

  if (files.length === 0) {
    console.log(`⚠️ Folder "${folder}" kosong, skip.`);
    return;
  }

  const items = files.map((file) => {
    const key = file
      .replace(/^icon-|^img-|^font-/, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/-/g, "_");
    return `${key}: \`${BASE_URL}/${folder}/${file}\``;
  });

  const content = `export const ${name} = { ${items.join(", ")} }; export type ${name}Name = keyof typeof ${name};`;
  fs.writeFileSync(path.join(ROOT, "src", `${name}.ts`), content);
}

Object.entries(folders).forEach(([folder, name]) => {
  generateAsset(folder, name);
});

console.log("✅ All assets generated generated!");
