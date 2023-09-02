import { createEffect, createSignal } from "solid-js";
import styles from "./Game.module.scss";
import { amountOfGuesses } from "../../constants";
import { Result, checkInput } from "../../utils";
import WinAnimation from "../WinAnimation/WinAnimation";

interface InputRef {
  current: HTMLInputElement | null;
}

export default function Game() {
  const [currentColor, setCurrentColor] = createSignal<string>("");
  const [currentRow, setCurrentRow] = createSignal<number>(0);
  const [guesses, setGuesses] = createSignal<string[]>([]);
  const [matches, setMatches] = createSignal<Result[][]>([] as Result[][]);
  const [animation, setAnimation] = createSignal<boolean>(false);
  const [won, setWon] = createSignal<boolean>(false);
  const [lost, setLost] = createSignal<boolean>(false);
  const numberOfCells = 6;
  const inputRefs: InputRef[][] = Array.from(
    { length: amountOfGuesses },
    (_, row) =>
      Array.from({ length: numberOfCells }, (_, cell) => ({
        current: null,
      }))
  );

  createEffect(() => {
    const guesses = localStorage.getItem("guesses");
    const currentRow = localStorage.getItem("currentRow");
    const matches = localStorage.getItem("matches");
    const hasWon = localStorage.getItem("won");
    const hasLost = localStorage.getItem("lost");

    if (hasWon) {
      setWon(JSON.parse(hasWon));
      return;
    }

    if (hasLost) {
      setLost(JSON.parse(hasLost));
      return;
    }

    if (guesses) {
      setGuesses(JSON.parse(guesses));
    }

    if (matches) {
      setMatches(JSON.parse(matches));
    }

    if (currentRow) {
      setCurrentRow(parseInt(currentRow));

      const currentInput = inputRefs[parseInt(currentRow)][0].current;
      if (currentInput) {
        currentInput.focus();
      }
    } else if (!won()) {
      const currentInput = inputRefs[0][0].current;
      if (currentInput) {
        currentInput.focus();
      }
    }
  }, []);

  const handleRemove = (e: KeyboardEvent, row: number, cell: number) => {
    if (e.key === "Backspace") {
      setCurrentColor(
        (prevColor) =>
          prevColor.slice(0, cell) + " " + prevColor.slice(cell + 1)
      );

      const previousInput = inputRefs[row][Math.max(cell - 1, 0)].current;
      if (previousInput) {
        previousInput.value = "";
        previousInput.focus();
      }
    }
  };

  const saveGameState = () => {
    localStorage.setItem("guesses", JSON.stringify(guesses()));
    localStorage.setItem("currentRow", currentRow().toString());
    localStorage.setItem("matches", JSON.stringify(matches()));
  };

  const handleInput = async (e: InputEvent, row: number, cell: number) => {
    if (e.inputType === "deleteContentBackward") {
      return;
    }

    if (e.data && !/[0-9a-f]/i.test(e.data)) {
      const currentInput = inputRefs[row][cell].current;
      if (currentInput) {
        currentInput.value = "";
      }
      return;
    }

    const currentInput = inputRefs[row][cell].current;
    if (currentInput) {
      currentInput.value = e.data!;
    }

    setCurrentColor(
      (prevColor) =>
        prevColor.slice(0, cell) +
        (currentInput?.value ?? "") +
        prevColor.slice(cell + 1)
    );

    if (cell === numberOfCells - 1) {
      setGuesses((prevGuesses) => [...prevGuesses, currentColor()]);
      await startAnimation(row);
      setCurrentColor("");

      if (row < amountOfGuesses - 1) {
        const nextInput = inputRefs[row + 1][0].current;
        if (nextInput) {
          nextInput.focus();
          setCurrentRow(row + 1);
        }
      }

      saveGameState();
    } else {
      const nextInput = inputRefs[row][cell + 1].current;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const startAnimation = async (row: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      const currentMatches = checkInput(currentColor());
      setMatches((prevMatches) => [...prevMatches, currentMatches]);
      setAnimation(true);

      //WON
      if (currentMatches.every((match) => match.type === "correct")) {
        setTimeout(() => {
          setAnimation(false);
          setCurrentRow(amountOfGuesses);

          setTimeout(() => {
            setWon(true);
            localStorage.setItem("won", "true");
            localStorage.setItem(
              "streak",
              (parseInt(localStorage.getItem("streak") ?? "0") + 1).toString()
            );
            localStorage.setItem("last_streak", new Date().toString());
            resolve(); // Resolve the Promise when the animation is complete
          }, 600);
        }, 1000);
      }
      //LOST
      else if (row === amountOfGuesses - 1) {
        setTimeout(() => {
          setAnimation(false);
          setCurrentRow(amountOfGuesses);

          setTimeout(() => {
            setLost(true);
            localStorage.setItem("lost", "true");
            localStorage.setItem("streak", "0");
            localStorage.removeItem("last_streak");
            resolve(); // Resolve the Promise when the animation is complete
          }, 600);
        }, 1000);
      }
      //NEXT ROW
      else {
        // If there's no animation to wait for, resolve immediately
        setTimeout(() => {
          setAnimation(false);
          resolve();
        }, 1000);
      }
    });
  };

  return (
    <div class={styles.game}>
      {(won() || lost()) && <WinAnimation won={won()} />}
      {!won() &&
        !lost() &&
        Array.from({ length: amountOfGuesses }, (_, row) => (
          <div class={styles.row}>
            {Array.from({ length: numberOfCells }, (_, cell) => (
              <div class={styles.cell}>
                <input
                  ref={(el) => (inputRefs[row][cell].current = el)}
                  readOnly={animation() || currentRow() !== row}
                  class={
                    currentRow() !== row
                      ? styles.cell_input +
                        " " +
                        styles[matches()?.at(row)?.at(cell)?.type ?? ""]
                      : styles.cell_input +
                        " " +
                        (animation() &&
                          styles.animation +
                            " " +
                            styles[matches()?.at(row)?.at(cell)?.type ?? ""])
                  }
                  style={{ "animation-delay": `${cell * 100}ms` }}
                  value={
                    currentRow() === row
                      ? currentColor()?.at(cell) ?? ""
                      : guesses()?.at(row)?.at(cell) ?? ""
                  }
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
        ))}
    </div>
  );
}
