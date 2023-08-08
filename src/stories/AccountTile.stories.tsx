import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountTileDisplay } from "../components/AccountTile/AccountTileDisplay";

export default {
  title: "Umami/AccountTile",
  component: AccountTileDisplay,
} as ComponentMeta<typeof AccountTileDisplay>;

const Template: ComponentStory<typeof AccountTileDisplay> = args => (
  <AccountTileDisplay {...args} />
);

export const Nominal = Template.bind({});
Nominal.args = {
  label: "My super account",
  address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  balance: "34,12 tez",
};

export const Selected = Template.bind({});
Selected.args = {
  selected: true,
  label: "My super account",
  address: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  balance: "34,12 tez",
};
