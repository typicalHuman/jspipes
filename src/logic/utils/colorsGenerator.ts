export function generateBeautifulColors(salt: number): {
  baseColor: string;
  contrastColor: string;
} {
  // Generate a pseudo-random value between 0 and 1 based on the salt
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate a pastel color for the background
  const generateBaseColor = (seed: number): string => {
    const r = Math.floor(seededRandom(seed) * 128 + 127); // Pastel range: 127–255
    const g = Math.floor(seededRandom(seed + 1) * 128 + 127);
    const b = Math.floor(seededRandom(seed + 2) * 128 + 127);
    return `rgb(${r},${g},${b})`;
  };

  // Generate a complementary color for better contrast
  const generateContrastColor = (color: string): string => {
    const rgb = color.match(/\d+/g)?.map(Number); // Extract RGB values
    if (!rgb || rgb.length !== 3) {
      throw new Error("Invalid color format");
    }

    // Calculate complementary color
    const [r, g, b] = rgb.map((value) => 255 - value);
    return `rgb(${r},${g},${b})`;
  };

  const baseColor = generateBaseColor(salt);
  const contrastColor = generateContrastColor(baseColor);

  return { baseColor, contrastColor };
}
