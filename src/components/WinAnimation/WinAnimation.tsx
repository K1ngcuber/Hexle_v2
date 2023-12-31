import { createEffect, createSignal } from "solid-js";
import styles from "./WinAnimation.module.scss";
import { getColorOfTheDay, getFontColorForBackground } from "../../utils";

const particles = ["✨", "🎉", "🎊", "🎈"];
const particleCount = 200;

const startParticles = () => {
  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }
};

const createParticle = () => {
  const particle = document.createElement("particle");
  const size = Math.floor(Math.random() * 5);

  const spawnPoint = document.getElementsByClassName(styles.winHeader)[0];
  const { x, y, width, height } = spawnPoint.getBoundingClientRect();

  // Calculate the center of the <h1> element
  const centerX = 0;
  const centerY = -y;

  particle.className = styles.particle;
  particle.textContent =
    particles[Math.floor(Math.random() * particles.length)];
  particle.style.fontSize = `${size}rem`;

  spawnPoint.append(particle);

  animate(centerX, centerY, particle, size);
};

const animate = (x: number, y: number, particle: HTMLElement, size: number) => {
  const destinationX = x + (Math.random() - 0.5) * 2 * 500;
  const destinationY = y + (Math.random() - 0.5) * 2 * 200;

  // Store the animation in a variable because we will need it later
  const animation = particle.animate(
    [
      {
        // Set the origin position of the particle
        // We offset the particle with half its size to center it around the mouse
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        opacity: 1,
      },
      {
        // We define the final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 1,
      },
    ],
    {
      // Set a random duration from 500 to 1500ms
      duration: 500 + Math.random() * 1000,
      easing: "cubic-bezier(0, .9, .57, 1)",
      // Delay every particle with a random value from 0ms to 200ms
      delay: Math.random() * 200,
    }
  );

  animation.onfinish = () => {
    //Fade out
    particle.animate(
      [
        {
          transform: `translate(${destinationX}px, ${destinationY}px)`,

          opacity: 1,
        },
        {
          transform: `translate(${destinationX}px, ${destinationY}px)`,

          opacity: 0,
        },
      ],
      {
        duration: 500,
        easing: "ease-in",
      }
    ).onfinish = () => {
      particle.remove();
    };
  };
};

export default function WinAnimation(props: any) {
  const [color, setColor] = createSignal<string>(getColorOfTheDay());
  const [countDown, setCountDown] = createSignal<string>("");
  const streak = localStorage.getItem("streak");

  createEffect(() => {
    if (props.won) {
      startParticles();
    }
    getCountDown();
    countDownInterval();
  }, []);

  const countDownInterval = () => {
    setInterval(() => {
      getCountDown();

      if (countDown() === "00:00") {
        //clear local storage
        localStorage.clear();
        //reload page
        window.location.reload();
      }
    }, 1000);
  };

  const getCountDown = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountDown(
      `${hours > 0 ? hours+":" : ""}${minutes < 10 ? "0" + minutes : minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`
    );
  };

  return (
    <div class={styles.winHeader}>
      <h1>{props.won ? "🥳 Nice one 🥳" : "😢 Oh no 😢"}</h1>
      <h2>
        Todays color was <br />
        {/* make it copyable */}
      </h2>
      <a
        onClick={(e) => {
          navigator.clipboard.writeText(color());
          //show tooltip
          const tooltip = document.createElement("div");
          tooltip.className = styles.tooltip;
          tooltip.textContent = "Copied to clipboard";

          e.currentTarget.append(tooltip);
          //position tooltip
          const { x, y, width, height } =
            e.currentTarget.getBoundingClientRect();
          tooltip.style.left = `${x + width / 2 - tooltip.offsetWidth / 2}px`;
          tooltip.style.top = `${y - tooltip.offsetHeight - 10}px`;

          setTimeout(() => {
            tooltip.remove();
          }, 1000);
        }}
        class={styles.colorCode}
        style={{
          "background-color": color(),
          color: getFontColorForBackground(color()),
        }}
      >
        {color()}
      </a>
      <div class={styles.streak}>
        <span class={styles.streakCount}>Your streak: {streak}🔥</span>
      </div>
      <div class={styles.count_down}>
        Next color in:
        <br />
        {countDown()}
      </div>
    </div>
  );
}
