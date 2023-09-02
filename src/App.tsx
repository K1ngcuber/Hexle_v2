import { createEffect, type Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { getColorOfTheDay } from "./utils";
import Game from "./components/Game/Game";
import Tutorial from "./components/Tutorial/Tutorial";

const App: Component = () => {
  const [color, _setColor] = createSignal<string>(getColorOfTheDay());
  const [showTutorial, setShowTutorial] = createSignal<boolean>(true);

  createEffect(() => {
    //set body background color
    document.body.style.backgroundColor = color();

    const savedColor = localStorage.getItem("color");
    const dontShowTutorial = localStorage.getItem("dontShowTutorial");
    const lastStreak = localStorage.getItem("lastStreak");

    if (lastStreak) {
      const lastStreakDate = new Date(parseInt(lastStreak));
      const now = new Date();
      const diff = now.getTime() - lastStreakDate.getTime();

      if (diff > 1000 * 60 * 60 * 24) {
        localStorage.removeItem("lastStreak");
        localStorage.setItem("streak", "0");
      }
    }

    if (dontShowTutorial) {
      setShowTutorial(false);
    }
    
    if (savedColor !== color()) {
      //clear storage
      localStorage.removeItem("guesses");
      localStorage.removeItem("currentRow");
      localStorage.removeItem("matches");
      localStorage.removeItem("won");
      localStorage.removeItem("lost");
    }
    
    localStorage.setItem("color", color());
  }, []);

  return (
    <div class={styles.App}>
      <Header />
      <main class={styles.main}>
        {showTutorial() ? (
          <Tutorial
            closeTutorial={() => {
              setShowTutorial(false);
              localStorage.setItem("dontShowTutorial", "true");
            }}
          />
        ) : (
          <Game />
        )}
      </main>
      <Footer showTutorial={() => setShowTutorial(true)} />
    </div>
  );
};

export default App;
