
    export const fonts = {
      candlescript: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/Candlescript`,
  greatvibes_regular: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/GreatVibes-Regular`,
  ranga: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/Ranga`,
  fontstyle: `https://raw.githubusercontent.com/rahmatsaputra-my-id/global-assets/master/fonts/fontstyle.css`
    } as const;

    export type fontsName = keyof typeof fonts;
  