import { type Meta, type StoryObj } from "@storybook/react";

import { ColorSchemeModeToggle } from "./ColorSchemeModeToggle";

const meta: Meta<typeof ColorSchemeModeToggle> = {
  title: "ColorSchemeModeToggle",
  component: ColorSchemeModeToggle,
  argTypes: {},
  args: {},
  parameters: {},
};

export default meta;

export const Default: StoryObj<typeof ColorSchemeModeToggle> = {
  render: args => <ColorSchemeModeToggle />,
};
