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

type Result = "correct" | "included" | "incorrect";

export const checkMatches = (guessColor: string): Result[] => {
  //todo
  return ["correct", "included", "incorrect"];
};
