import styles from "./Footer.module.scss";

export default function Footer(props: any) {
  return (
    <footer class={styles.footer}>
      <p
        onClick={props.showTutorial}
        class={styles.footer_text + " " + styles.hover}
      >
        How to play
      </p>
      <p class={styles.footer_text}>
        Made with <span class={styles.heart}>❤️</span> by{" "}
        <a href="https://github.com/K1ngcuber">Otterman 🦦</a>
      </p>
      <div class={styles.coffee_link}>
        <a href="https://www.buymeacoffee.com/maxikriegl">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style="height: 35px !important;"
          />
        </a>
      </div>
    </footer>
  );
}
