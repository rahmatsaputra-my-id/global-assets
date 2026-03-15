
    export const FONTS = {
      Candlescript: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/Candlescript`,
  GreatVibes_Regular: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/GreatVibes-Regular`,
  Ranga: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/Ranga`,
  fontstyle: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/fontstyle.css`
    } as const;

    export type FONTSName = keyof typeof FONTS;
  