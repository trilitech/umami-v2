import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountTileDisplay } from "../components/AccountTile/AccountTileDisplay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Umami/AccountTile",
  component: AccountTileDisplay,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof AccountTileDisplay>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountTileDisplay> = args => (
  <AccountTileDisplay {...args} />
);

export const Nominal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Nominal.args = {
  label: "My super account",
  address: "thisIsMyPkh",
  balance: "34,12 tez",
};

export const Selected = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Selected.args = {
  selected: true,
  label: "My super account",
  address: "thisIsMyPkh",
  balance: "34,12 tez",
};
