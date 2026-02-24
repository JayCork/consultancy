import "../src/styles.module.css";
import "../src/global.css";

/** @type { import('storybook-solidjs-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    tags: ["autodocs"],
  },
  tags: ["autodocs"],
};

export default preview;
