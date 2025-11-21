import "../src/app/globals.css";

import type { Preview } from "@storybook/react-vite";

// Next.js Link 모킹 (Storybook 환경)
if (typeof window !== "undefined") {
  // @ts-ignore
  window.process = window.process || { env: {} };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#f7f8fa" },
        { name: "dark-surface", value: "#0b1117" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
