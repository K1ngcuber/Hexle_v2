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

export type Result = {
  type: "correct" | "included" | "wrong";
  index: number;
};

export const checkMatches = (guessColor: string): Result[] => {
  //todo
  const checked = {} as { [key: string]: number };
  const results = [] as Result[];
  const truth = getColorOfTheDay().toLowerCase().slice(1);
  guessColor = guessColor.toLowerCase();

  //set all to wrong
  for (let i = 0; i < guessColor.length; i++) {
    results.push({ type: "wrong", index: i });
  }

  //check for correct
  for (let i = 0; i < guessColor.length; i++) {
    if (guessColor[i] === truth[i]) {
      results[i].type = "correct";
      checked[truth[i]]++;
    }
  }

  //check for included
  for (let i = 0; i < guessColor.length; i++) {
    if (guessColor[i] !== truth[i] && truth.includes(guessColor[i])) {
      if (checked[guessColor[i]] === undefined) {
        checked[guessColor[i]] = 0;
      }
      if (checked[guessColor[i]] < truth.split(guessColor[i]).length - 1) {
        results[i].type = "included";
        checked[guessColor[i]]++;
      }
    }
  }

  //order by index
  results.sort((a, b) => a.index - b.index);

  return results;
};

export const checkInput = (input: string): Result[] => {
  //without the hastag
  input = input.toUpperCase();
  const colorCode = getColorOfTheDay().toUpperCase().slice(1);
  const tryResult = [] as Result[];

  //create a list of 6 tryresults
  for (let i = 0; i < 6; i++) {
    tryResult.push({
      index: i,
      type: "wrong",
    });
  }

  //check how often each letter appears in the color code
  const colorCodeLetterCount = {} as Record<string, number>;
  for (const letter of colorCode) {
    if (colorCodeLetterCount[letter]) {
      colorCodeLetterCount[letter]++;
    } else {
      colorCodeLetterCount[letter] = 1;
    }
  }

  //check for matching letters
  for (let i = 0; i < 6; i++) {
    if (input[i] === colorCode[i]) {
      tryResult[i].type = "correct";
      colorCodeLetterCount[colorCode[i]]--;
    }
  }

  //check for close matches
  for (let i = 0; i < 6; i++) {
    if (colorCodeLetterCount[input[i]] && tryResult[i].type === "wrong") {
      tryResult[i].type = "included";
      colorCodeLetterCount[input[i]]--;
    }
  }

  return tryResult;
};
