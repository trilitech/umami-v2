import { Meta, StoryObj } from "@storybook/react";
import { IconAndTextBtn } from "../components/IconAndTextBtn";
import { MdArrowOutward } from "react-icons/md";
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Umami/IconAndTextBtn",
  component: IconAndTextBtn,
} as Meta<typeof IconAndTextBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithArrowIcon: Story = {
  args: {
    icon: MdArrowOutward,
    label: "TextGoesHere",
  },
};

export const TextFirst: Story = {
  args: {
    icon: MdArrowOutward,
    label: "TextGoesHere",
    textFirst: true,
  },
};
