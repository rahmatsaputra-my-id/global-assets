/**
 * Definisi tipe agar warna bisa berfungsi sebagai string
 * sekaligus objek yang memiliki shades.
 */
type ColorScale = string & {
    readonly [key in 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900]: string;
};
export declare const COLORS: {
    readonly white: string;
    readonly black: string;
    readonly gray: string;
    readonly lightGray: string;
    readonly darkGray: string;
    readonly silver: string;
    readonly red: ColorScale;
    readonly blue: ColorScale;
    readonly green: ColorScale;
    readonly yellow: ColorScale;
    readonly orange: ColorScale;
    readonly purple: ColorScale;
    readonly pink: ColorScale;
    readonly cyan: ColorScale;
    readonly teal: ColorScale;
    readonly indigo: ColorScale;
    readonly brown: ColorScale;
    readonly lime: ColorScale;
    readonly magenta: ColorScale;
    readonly navy: ColorScale;
    readonly olive: ColorScale;
    readonly maroon: ColorScale;
    readonly gold: ColorScale;
    readonly primary: ColorScale;
    readonly secondary: ColorScale;
    readonly success: ColorScale;
    readonly warning: ColorScale;
    readonly error: ColorScale;
    readonly info: ColorScale;
};
export declare const THEMES: {
    readonly light: {
        readonly background: "#FFFFFF";
        readonly text: "#101828";
        readonly surface: "#F9FAFB";
        readonly border: "#E4E7EC";
    };
    readonly dark: {
        readonly background: "#0C111D";
        readonly text: "#F2F4F7";
        readonly surface: "#1D2939";
        readonly border: "#344054";
    };
};
export declare const withOpacity: (color: string | any, opacity: number) => string;
export {};
