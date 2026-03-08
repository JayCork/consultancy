import "../../tokens/index.css";
import type { Preview } from "storybook-solidjs-vite";

const preview: Preview = {
  decorators: [
    (Story) => {
      document.documentElement.style.colorScheme = "light dark";
      return Story();
    },
  ],
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
