import "../../tokens/index.css";
import type { Preview } from "storybook-solidjs-vite";
import { JSX } from "solid-js";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
