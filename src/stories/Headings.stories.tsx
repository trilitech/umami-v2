import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Heading } from "@chakra-ui/react";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Umami/Headings",
  component: Heading,
} as ComponentMeta<typeof Heading>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Heading> = (args: any) => <Heading {...args} />;

const exampleTxt = "This is an Umami heading";
export const Xs = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Xs.args = {
  size: "xs",
  children: exampleTxt,
};

export const Sm = Template.bind({});
Sm.args = {
  size: "sm",
  children: exampleTxt,
};

export const Md = Template.bind({});
Md.args = {
  size: "md",
  children: exampleTxt,
};

export const Lg = Template.bind({});
Lg.args = {
  size: "lg",
  children: exampleTxt,
};
