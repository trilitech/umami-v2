import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FillStep } from "../components/sendForm/steps/FillStep";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const SendForm = FillStep;

export default {
  title: "Umami/SendForm",
  component: SendForm,
} as ComponentMeta<typeof SendForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SendForm> = args => <SendForm {...args} />;

// const mockAccounts = [
//   {
//     label: "My account 1",
//     pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
//   },
//   {
//     label: "My account 2",
//     pkh: "tz1UNer1ijeE9ndjzSszRduR3CzJJ9hoBUBD",
//   },
//   {
//     label: "My account 3",
//     pkh: "tz1UNjr1ikeE9ndjzSszRduR3CzJJ9hohUai",
//   },
// ] as Account[];

export const Nominal = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Nominal.args = {};
