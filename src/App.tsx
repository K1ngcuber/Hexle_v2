import { createEffect, type Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { getColorOfTheDay } from "./utils";
import Game from "./components/Game/Game";
import Tutorial from "./components/Tutorial/Tutorial";

const App: Component = () => {
  const [color, setColor] = createSignal<string>(getColorOfTheDay());
  const [showTutorial, setShowTutorial] = createSignal<boolean>(true);

  createEffect(() => {
    //set body background color
    document.body.style.backgroundColor = color();

    const savedColor = localStorage.getItem("color");
    const dontShowTutorial = localStorage.getItem("dontShowTutorial");

    if (dontShowTutorial) {
      setShowTutorial(false);
    }

    if (savedColor !== color()) {
      //clear storage
    }
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
