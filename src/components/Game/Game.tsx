import { createSignal } from "solid-js";
import styles from "./Game.module.scss";
import { amountOfGuesses } from "../../constants";
import { checkMatches } from "../../utils";

export default function Game() {
  const [currentColor, setCurrentColor] = createSignal<string>("000000");
  const [guesses, setGuesses] = createSignal<string[]>([]);
  //create a list of refs for each input
  const inputs = Array.from({ length: amountOfGuesses }, (_, row) => row).map(
    (_, row) =>
      Array.from({ length: amountOfGuesses }, (_, cell) => cell).map(
        (_, cell) => createSignal<HTMLInputElement>()
      )
  );

  const handleRemove = (e: KeyboardEvent, row: number, cell: number) => {
    if (e.key === "Backspace") {
      setCurrentColor(
        currentColor().slice(0, cell) + "-" + currentColor().slice(cell + 1)
      );
      //focus the previous input

      const previousInput = inputs[row][Math.max(cell - 1, 0)][0]();
      //set previous input to empty
      previousInput!.value = "";
      previousInput?.focus();
      return;
    }
  };

  const handleInput = (e: InputEvent, row: number, cell: number) => {
    if (e.inputType === "deleteContentBackward") {
      return;
    }
    //if the input is not a hex value, ignore it
    if (e.data && !/[0-9a-f]/i.test(e.data)) {
      //set the input to empty
      (e.target as HTMLInputElement).value = "";
      return;
    }

    const currentInput = inputs[row][cell][0]();
    currentInput!.value = e.data!;

    setCurrentColor(
      currentColor().slice(0, cell) +
        (e.target as HTMLInputElement).value +
        currentColor().slice(cell + 1)
    );

    if (cell === 5) {
      //submit the guess
      setGuesses([...guesses(), currentColor()]);
      //apply the animation class to the row
      startAnimation(row);

      console.log(checkMatches(currentColor()));
      setCurrentColor("000000");

      //focus the first input of the next row
      if (row === amountOfGuesses - 1) {
        return;
      }

      inputs[row + 1][0][0]()?.focus();

      return;
    }
    //focus the next input
    inputs[row][Math.min(cell + 1, 5)][0]()?.focus();
  };

  const startAnimation = (row: number) => {
    inputs[row].forEach((input, cell) => {
      input[0]()!.classList.add(styles.animation);

      if (input[0]()!.value === currentColor()[cell]) {
        input[0]()!.value = "0";
      }
    });
  };

  return (
    <div class={styles.game}>
      {Array.from({ length: amountOfGuesses }, (_, row) => row).map(
        (_, row) => (
          <div class={styles.row}>
            {Array.from({ length: 6 }, (_, cell) => cell).map((_, cell) => (
              <div class={styles.cell}>
                <input
                  ref={(el) => inputs[row][cell][1](el)}
                  class={styles.cell_input}
                  style={{ "animation-delay": `${cell * 100}ms` }}
                  onKeyUp={(e) => {
                    handleRemove(e, row, cell);
                  }}
                  onInput={(e) => {
                    handleInput(e, row, cell);
                  }}
                />
              </div>
            ))}
            <div class={styles.cell}>
              <div
                class={styles.row_color}
                style={{
                  "background-color": `#${guesses()[row] ?? "fff"}`,
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}
