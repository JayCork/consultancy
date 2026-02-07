

/** @type { import('storybook-solidjs-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": ["storybook-css-modules",],
  "framework": "storybook-solidjs-vite"
};
export default config;