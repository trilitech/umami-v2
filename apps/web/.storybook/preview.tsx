import type { Preview } from "@storybook/react";
import { UmamiTheme } from "../src/providers/UmamiTheme";

const preview: Preview = {
  decorators: [
    Story => (
      <UmamiTheme>
        <Story />
      </UmamiTheme>
    ),
  ],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
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
