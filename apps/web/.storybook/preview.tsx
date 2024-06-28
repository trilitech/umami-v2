import type { Preview, Decorator } from "@storybook/react";
import { UmamiTheme } from "../src/providers/UmamiTheme";
import { dark, light } from "../src/styles/colors";

const withThemeDecorator: Decorator = Story => (
  <UmamiTheme>
    <Story />
  </UmamiTheme>
);

const preview: Preview = {
  decorators: [withThemeDecorator],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: light.bg,
        },
        {
          name: "dark",
          value: dark.bg,
        },
      ],
    },
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
