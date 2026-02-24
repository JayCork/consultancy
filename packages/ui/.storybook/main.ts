import { mergeConfig } from "vite";
import path from "path";

interface StorybookConfig {
  stories: string[];
  addons: string[];
  framework: string;
  viteFinal: (
    config: import("vite").UserConfig,
  ) => Promise<import("vite").UserConfig>;
}

export default {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: ["storybook-css-modules"],

  framework: "storybook-solidjs-vite",
  viteFinal: async (
    config: import("vite").UserConfig,
  ): Promise<import("vite").UserConfig> => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@consultancy/ui": path.resolve(new URL("../src", import.meta.url).pathname),
          "@consultancy/ui/*": path.resolve(new URL("../src/*", import.meta.url).pathname),
        },
      },
    });
  },
} as StorybookConfig;
