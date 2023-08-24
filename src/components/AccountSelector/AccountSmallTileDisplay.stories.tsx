import { Meta, StoryObj } from "@storybook/react";
import { AccountType } from "../../types/Account";
import { AccountSmallTileDisplay } from "./AccountSmallTileDisplay";

const meta = {
  title: "Umami/AccountSmallTileDisplay",
  component: AccountSmallTileDisplay,
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof AccountSmallTileDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "My super account",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: AccountType.MNEMONIC,
  },
};

export const DefaultWithBalance: Story = {
  args: {
    label: "My super account",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: AccountType.MNEMONIC,
    balance: "738002021",
  },
};

export const Multisig: Story = {
  args: {
    label: "My super account",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: AccountType.MULTISIG,
  },
};

export const Social: Story = {
  args: {
    label: "My super account",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: AccountType.SOCIAL,
  },
};

export const Contact: Story = {
  args: {
    label: "My super account",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: "contact",
  },
};

export const Baker: Story = {
  args: {
    label: "My super baker",
    pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
    kind: "baker",
  },
};
