import { UmamiTheme } from "../src/providers/UmamiTheme";
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const decorators = [
  (Story) => (
    <UmamiTheme>
      <Story />
    </UmamiTheme>
  ),
];
