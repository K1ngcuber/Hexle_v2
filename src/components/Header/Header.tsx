import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header class={styles.header}>
      <h1 class={styles.main_title}>Hexle</h1>
      <h2 class={styles.sub_title}>guess the color</h2>
    </header>
  );
}
