import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer class={styles.footer}>
      <p class={styles.footer_text}>
        Made with <span class={styles.heart}>❤️</span> by{" "}
        <a href="https://github.com/K1ngcuber">Otterman 🦦</a>
      </p>
    </footer>
  );
}
