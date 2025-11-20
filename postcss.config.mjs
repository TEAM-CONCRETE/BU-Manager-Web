import tailwindcss from "@tailwindcss/postcss";

const isStorybook = Boolean(process.env.STORYBOOK);

const config = {
  plugins: isStorybook ? [tailwindcss()] : { "@tailwindcss/postcss": {} },
};

export default config;
