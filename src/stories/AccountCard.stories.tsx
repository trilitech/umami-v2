import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AccountCardDisplay } from "../components/AccountCard/AccountCardDisplay";
import { BigNumber } from "bignumber.js";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Umami/AccountCard",
  component: AccountCardDisplay,
} as ComponentMeta<typeof AccountCardDisplay>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AccountCardDisplay> = (args) => (
  <AccountCardDisplay {...args} />
);

export const Nominal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Nominal.args = {
  label: "My super account",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  tezBalance: "120.234",
  dollarBalance: new BigNumber(13000),
};
