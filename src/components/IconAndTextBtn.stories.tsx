import { ComponentMeta, ComponentStory } from "@storybook/react";
import { IconAndTextBtn } from "../components/IconAndTextBtn";
import { MdArrowOutward } from "react-icons/md";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Umami/IconAndTextBtn",
  component: IconAndTextBtn,
} as ComponentMeta<typeof IconAndTextBtn>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof IconAndTextBtn> = args => <IconAndTextBtn {...args} />;

export const WithArrowIcon = Template.bind({});
WithArrowIcon.args = {
  icon: MdArrowOutward,
  label: "TextGoesHere",
};

export const TextFirst = Template.bind({});
TextFirst.args = {
  icon: MdArrowOutward,
  label: "TextGoesHere",
  textFirst: true,
};
