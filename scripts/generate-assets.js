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

  if (!fs.existsSync(dir)) return;

  const files = fs
    .readdirSync(dir)
    .filter((file) => !file.startsWith(".") && !file.endsWith(".DS_Store"));

  if (files.length === 0) return;

  const items = files.map((file) => {
    const key = file
      .replace(/^icon-|^img-|^font-/, "")
      .replace(/\.[^/.]+$/, "")
      .replace(/-/g, "_")
      .toLowerCase();
    return `${key}: \`${BASE_URL}/${folder}/${file}\``;
  });

  const content = `
    export const ${name.toLowerCase()} = {
      ${items.join(",\n  ")}
    } as const;

    export type ${name.toLowerCase()}Name = keyof typeof ${name.toLowerCase()};
  `;

  fs.writeFileSync(path.join(ROOT, "src", `${name.toLowerCase()}.ts`), content);
  console.log(`✅ ${name.toLowerCase()} generated`);
}

/**
 * BASE COLORS + SCALE COLORS
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

const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800];

/**
 * GENERATE SCALE
 */
function generateScale(color) {
  const scale = chroma
    .scale(["#ffffff", color, "#000000"])
    .mode("lab")
    .colors(steps.length);
  const result = {};
  steps.forEach((step, i) => (result[step] = scale[i]));
  return result;
}

/**
 * GENERATE COLORS OBJECT
 */
function generateColors() {
  const COLORS_OBJ = {};

  Object.entries(flatColors).forEach(([name, color]) => {
    COLORS_OBJ[name] = chroma(color).hex();
  });

  Object.entries(scaleColors).forEach(([name, color]) => {
    COLORS_OBJ[name] = generateScale(color);
  });

  const lightTheme = {
    background: "#FFFFFF",
    text: "#101828",
    surface: "#F9FAFB",
    border: "#E4E7EC",
    cardBackground: "#F8F8F8",
    cardColor: "#101828",
  };
  const darkTheme = {
    background: "#0C111D",
    text: "#F2F4F7",
    surface: "#1D2939",
    border: "#344054",
    cardBackground: "#1D2939",
    cardColor: "#F2F4F7",
  };

  let colorsContent = "";
  let typeDefinitions = "";

  Object.entries(COLORS_OBJ).forEach(([name, value]) => {
    if (typeof value === "string") {
      colorsContent += `  ${name}: "${value}",\n`;
      typeDefinitions += `  readonly ${name}: "${value}";\n`;
    } else {
      colorsContent += `  ${name}: (Object as any).assign("${value[500]}", ${JSON.stringify(value)}),\n`;
      typeDefinitions += `  readonly ${name}: "${value[500]}" & {\n`;
      Object.entries(value).forEach(([step, hex]) => {
        typeDefinitions += `    readonly "${step}": "${hex}";\n`;
      });
      typeDefinitions += `  };\n`;
    }
  });

  const content = `
    export const colors: {\n${typeDefinitions}} = {
    ${colorsContent}
    } as any;

    export const themes = {
      light: ${JSON.stringify(lightTheme, null, 2)},
      dark: ${JSON.stringify(darkTheme, null, 2)}
    } as const;

    export const withOpacity = (color: string | any, opacity: number): string => {
      const hex = typeof color === 'string' ? color : color.toString();
      if (!hex || hex.length < 7) return 'rgba(0,0,0,0)';
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return \`rgba(\${r}, \${g}, \${b}, \${opacity})\`;
    };

    export const withGradient = (color: string | any, toColor: string = 'transparent', direction: string = 'to bottom'): string => {
      const from = typeof color === 'string' ? color : color.toString();
      return \`linear-gradient(\${direction}, \${from}, \${toColor})\`;
    };
  `;

  const colorsFile = path.join(ROOT, "src", "COLORS.ts");
  fs.writeFileSync(colorsFile, content);
}

/**
 * RUN ALL GENERATORS
 */
Object.entries(folders).forEach(([folder, name]) =>
  generateAsset(folder, name),
);
generateColors();

console.log("🚀 All assets generated!");
