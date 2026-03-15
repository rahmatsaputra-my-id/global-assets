const fs = require("fs");
const path = require("path");
const chroma = require("chroma-js");

const BASE_URL =
  "https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master";

const ROOT = path.join(__dirname, "..");

const folders = {
  icons: "ICONS",
  images: "IMAGES",
  fonts: "FONTS",
};

/**
 * GENERATE ICONS / IMAGES / FONTS
 */
function generateAsset(folder, name) {
  const dir = path.join(ROOT, folder);

  if (!fs.existsSync(dir)) {
    console.log(`⚠️ Folder "${folder}" tidak ditemukan, skip.`);
    return;
  }

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

  const content = `
    export const ${name} = {
      ${items.join(",\n  ")}
    } as const;

    export type ${name}Name = keyof typeof ${name};
  `;

  fs.writeFileSync(path.join(ROOT, "src", `${name}.ts`), content);
  console.log(`✅ ${name} generated`);
}

/**
 * GENERATE COLOR PALETTES
 */

const baseColors = {
  primary: "#B82025",
  secondary: "#1E5EFF",
  success: "#2AC769",
  warning: "#FFB020",
  error: "#FF5630",
  info: "#3C8DFF",

  purple: "#7A5AF8",
  pink: "#EE46BC",
  orange: "#F79009",
  teal: "#14B8A6",
  cyan: "#06B6D4",
  indigo: "#6366F1",
};

const steps = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

function generateScale(color) {
  const scale = chroma
    .scale(["#ffffff", color, "#000000"])
    .mode("lab")
    .colors(steps.length);

  const result = {};

  steps.forEach((step, i) => {
    result[step] = scale[i];
  });

  return result;
}

function generateColors() {
  const palettes = {};

  Object.entries(baseColors).forEach(([name, color]) => {
    palettes[name] = generateScale(color);
  });

  const lightTheme = {
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#101828",
    border: "#E4E7EC",
  };

  const darkTheme = {
    background: "#0C111D",
    surface: "#1D2939",
    text: "#F2F4F7",
    border: "#344054",
  };

  const content = `
    /**
     * AUTO GENERATED FILE
     */

    export const palettes = ${JSON.stringify(palettes, null, 2)} as const;

    export const themes = {
      light: ${JSON.stringify(lightTheme, null, 2)},
      dark: ${JSON.stringify(darkTheme, null, 2)}
    } as const;

    export type PaletteName = keyof typeof palettes;
    export type ThemeName = keyof typeof themes;
  `;

  const colorsDir = path.join(ROOT, "colors");

  if (!fs.existsSync(colorsDir)) {
    fs.mkdirSync(colorsDir);
  }

  fs.writeFileSync(path.join(colorsDir, "colors.ts"), content);

  console.log("🎨 Colors generated");
}

/**
 * RUN GENERATORS
 */

Object.entries(folders).forEach(([folder, name]) => {
  generateAsset(folder, name);
});

generateColors();

console.log("🚀 All assets generated!");
