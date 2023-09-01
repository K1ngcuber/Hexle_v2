import { createEffect, createSignal } from "solid-js";
import styles from "./Tutorial.module.scss";
import gameStyles from "../Game/Game.module.scss";

export default function Tutorial(props: any) {
  const [step, setStep] = createSignal<number>(0);

  const handleClose = () => {
    props.closeTutorial();
  };

  return (
    <div class={styles.tutorial}>
      <div class={styles.content}>
        <h1 class={styles.title}>How to play Hexle 🎨</h1>
        <div class={styles.steps}>
          {step() === 0 && (
            <div class={styles.step}>
              <h2 class={styles.stepTitle}>🎯 Guess the Color</h2>
              <p class={styles.stepDescription}>
                The color you see in the background is the color of the day.
                Take your best guess! 🤔
              </p>
            </div>
          )}
          {step() === 1 && (
            <div class={styles.step}>
              <h2 class={styles.stepTitle}>🔍 Clues</h2>
              <p class={styles.stepDescription}>
                After you've entered your guess, we'll give you some hints:
              </p>
              <span>
                <input
                  readonly
                  value="A"
                  class={gameStyles.cell_input + " " + gameStyles.correct}
                />
                - If it's correct! 🎉
              </span>
              <br />
              <span>
                <input
                  readonly
                  value="B"
                  class={gameStyles.cell_input + " " + gameStyles.included}
                />
                - If it's included. 🤔
              </span>
              <br />
              <span>
                <input
                  readonly
                  value="C"
                  class={gameStyles.cell_input + " " + gameStyles.wrong}
                />
                - If it's off. 😅
              </span>
              <br />
            </div>
          )}
          {step() === 2 && (
            <div class={styles.step}>
              <h2 class={styles.stepTitle}>🔄 Keep Guessing</h2>
              <p class={styles.stepDescription}>
                No giving up! Keep guessing until you find the color of the day.
                🌟
              </p>
            </div>
          )}
          {step() === 3 && (
            <div class={styles.step}>
              <h2 class={styles.stepTitle}>🦦 I hope you have fun 🦦</h2>
            </div>
          )}
        </div>
        <div class={styles.buttons}>
          {step() < 3 ? (
            <button class={styles.button} onClick={() => handleClose()}>
              Close
            </button>
          ) : (
            <div />
          )}
          <div class={styles.main_buttons}>
            <button
              class={styles.button}
              onClick={() => setStep(step() - 1)}
              disabled={step() === 0}
            >
              Previous
            </button>
            {step() === 3 ? (
              <button class={styles.button} onClick={() => handleClose()}>
                Start
              </button>
            ) : (
              <button
                class={styles.button}
                onClick={() => setStep(step() + 1)}
                disabled={step() === 3}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
