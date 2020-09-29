/* eslint-disable no-bitwise */
const rgbToHexUnique = (rgb: string): string => {
  let hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = `0${hex}`;
  }
  return hex;
};

export const rgbToHex = (rgb: string): string => {
  const [rgbValue] = rgb.match(/\(.*?\)/) || '';
  const [r, g, b] = rgbValue.replace(/(\(|\))/g, '').split(', ');

  const red = rgbToHexUnique(r);
  const green = rgbToHexUnique(g);
  const blue = rgbToHexUnique(b);

  return `#${red + green + blue}`;
};
