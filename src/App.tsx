import { createEffect, type Component, createSignal } from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.scss";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { getColorOfTheDay } from "./utils";
import Game from "./components/Game/Game";

const App: Component = () => {
  const [color, setColor] = createSignal<string>(getColorOfTheDay());

  createEffect(() => {
    //set body background color
    document.body.style.backgroundColor = color();

    const savedColor = localStorage.getItem("color");
    if (savedColor !== color()) {
      //invalidate local storage
      localStorage.clear();
    }
  }, []);

  return (
    <div class={styles.App}>
      <Header />
      <main class={styles.main}>
        <Game />
      </main>
      <Footer />
    </div>
  );
};

export default App;
