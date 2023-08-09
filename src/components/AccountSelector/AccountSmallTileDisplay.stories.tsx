import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

export default {
  title: "Umami/AccountSmallTileDisplay",
  component: AccountSmallTileDisplay,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof AccountSmallTileDisplay>;

const Template: ComponentStory<typeof AccountSmallTileDisplay> = args => (
  <AccountSmallTileDisplay {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "My super account",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
};
