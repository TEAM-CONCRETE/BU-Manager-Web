import "../src/app/globals.css";

import type { Preview } from "@storybook/react-vite";

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
