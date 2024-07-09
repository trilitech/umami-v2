import type { Preview } from "@storybook/react";
import { dark, light } from "../src/styles/colors";
import theme from "../src/styles/theme";
import { UmamiTheme } from "../src/providers/UmamiTheme";
import { useColorMode } from "@chakra-ui/system";
import { useEffect } from "react";

const ThemeToggleSync = ({ story, context }: any) => {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (context.globals.theme !== colorMode) {
      toggleColorMode();
    }
  }, [context.globals.theme, colorMode, toggleColorMode]);

  return story();
};

const preview: Preview = {
  decorators: [
    (story, context) => (
      <UmamiTheme>
        <ThemeToggleSync story={story} context={context} />
      </UmamiTheme>
    ),
  ],
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        // The label to show for this toolbar item
        title: "Theme",
        // Array of plain string values or MenuItem shape (see below)
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
      },
    },
  },
  parameters: {
    chakra: { theme },
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
