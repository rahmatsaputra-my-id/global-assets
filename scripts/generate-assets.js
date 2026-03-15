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
      .replace(/-/g, "_")
      .toLowerCase();

    return `${key}: \`${BASE_URL}/${folder}/${file}\``;
  });

  const content = `
export const ${name.toUpperCase()} = {
  ${items.join(",\n  ")}
} as const;

export type ${name.toUpperCase()}Name = keyof typeof ${name.toUpperCase()};
`;

  fs.writeFileSync(path.join(ROOT, "src", `${name.toUpperCase()}.ts`), content);
  console.log(`✅ ${name.toUpperCase()} generated`);
}

/**
 * BASE COLORS
 */
const flatColors = {
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
  lightGray: "#D3D3D3",
  darkGray: "#4B4B4B",
  silver: "#C0C0C0",
};

const scaleColors = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  pink: "#FFC0CB",
  cyan: "#00FFFF",
  teal: "#008080",
  indigo: "#4B0082",
  brown: "#A52A2A",
  lime: "#32CD32",
  magenta: "#FF00FF",
  navy: "#000080",
  olive: "#808000",
  maroon: "#800000",
  gold: "#FFD700",
  primary: "#B82025",
  secondary: "#1E5EFF",
  success: "#2AC769",
  warning: "#FFB020",
  error: "#FF5630",
  info: "#3C8DFF",
};

const steps = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * GENERATE SCALE
 */
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

/**
 * GENERATE COLORS
 */
function generateColors() {
  const COLORS = {};

  // Flat colors, tanpa scale
  Object.entries(flatColors).forEach(([name, color]) => {
    COLORS[name] = color;
  });

  // Scale colors
  Object.entries(scaleColors).forEach(([name, color]) => {
    const scale = generateScale(color);

    // Proxy untuk default 500
    COLORS[name] = new Proxy(scale, {
      get(target, prop) {
        if (prop === "toString") return () => target[500];
        if (prop === "valueOf") return () => target[500];
        if (prop === Symbol.toPrimitive) return () => target[500];
        if (prop in target) return target[prop];
        return target[500]; // fallback
      },
    });
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
export const COLORS = ${JSON.stringify(COLORS, null, 2)} as const;

export const THEMES = {
  light: ${JSON.stringify(lightTheme, null, 2)},
  dark: ${JSON.stringify(darkTheme, null, 2)}
} as const;

export type ThemeColorName = ${Object.keys(scaleColors)
    .map((c) => `"${c}"`)
    .join(" | ")};
export type ThemeName = keyof typeof THEMES;
`;

  const colorsFile = path.join(ROOT, "src", "COLORS.ts");
  fs.writeFileSync(colorsFile, content);
  console.log("🎨 COLORS + THEMES generated in src/COLORS.ts");
}

/**
 * RUN ALL GENERATORS
 */
Object.entries(folders).forEach(([folder, name]) => {
  generateAsset(folder, name);
});

generateColors();

console.log("🚀 All assets generated!");
