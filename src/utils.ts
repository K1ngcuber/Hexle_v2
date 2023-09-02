export const getColorOfTheDay = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are zero-indexed
  const day = now.getDate();

  // Create a seed for the random number generator based on the current date
  const seed = year * 10000 + month * 100 + day;

  // Use the seed to generate a random color
  const random = Math.abs(Math.sin(seed) * 16777215); // 16777215 is the decimal equivalent of #FFFFFF (white)
  const color = "#" + Math.floor(random).toString(16).padStart(6, "0"); // Convert the random number to hexadecimal

  return color;
};

export const getFontColorForBackground = (backgroundColor: string) => {
  // Convert the background color to RGB format
  const hexToRgb = (hex: any) =>
    hex
      .replace(
        /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
        (m: any, r: any, g: any, b: any) => `#${r}${r}${g}${g}${b}${b}`
      )
      .substring(1)
      .match(/.{2}/g)
      .map((x: any) => parseInt(x, 16));

  const [r, g, b] = hexToRgb(backgroundColor);

  // Calculate the relative luminance of the background color
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Determine the font color based on the luminance
  return luminance > 0.5 ? "black" : "white";
};

export type Result = {
  type: "correct" | "included" | "wrong";
  index: number;
};

export const checkInput = (input: string): Result[] => {
  // Convert input and color code to uppercase for case-insensitive comparison
  input = input.toUpperCase();
  const colorCode = getColorOfTheDay().toUpperCase().slice(1);

  // Initialize an array to store the results
  const results: Result[] = Array.from({ length: 6 }, (_, i) => ({
    index: i,
    type: "wrong", // Initialize all results as "wrong"
  }));

  // Count the occurrences of each letter in the color code
  const colorCodeLetterCount: Record<string, number> = {};
  for (const letter of colorCode) {
    colorCodeLetterCount[letter] = (colorCodeLetterCount[letter] || 0) + 1;
  }

  // Check for correct matches
  for (let i = 0; i < 6; i++) {
    if (input[i] === colorCode[i]) {
      results[i].type = "correct";
      colorCodeLetterCount[colorCode[i]]--;
    }
  }

  // Check for close matches
  for (let i = 0; i < 6; i++) {
    if (colorCodeLetterCount[input[i]] && results[i].type === "wrong") {
      results[i].type = "included";
      colorCodeLetterCount[input[i]]--;
    }
  }

  return results;
};
