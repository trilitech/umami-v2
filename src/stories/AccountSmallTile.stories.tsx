import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountSmallTileDisplay } from "../components/AccountSelector/AccountSmallTileDisplay";

export default {
  title: "Umami/AccountSmallTile",
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
