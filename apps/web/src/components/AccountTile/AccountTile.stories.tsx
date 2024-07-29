import { Flex, IconButton, Text } from "@chakra-ui/react";
import { type ArgTypes, type Meta, type StoryObj } from "@storybook/react";
import { makeStore } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { noop } from "lodash";
import { type PropsWithChildren, type ReactNode } from "react";
import { Provider } from "react-redux";

import { AccountTile } from "./AccountTile";
import { SelectorIcon, ThreeDotsIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { type MockAccountType, mockAccount, mockAccountTypes } from "../../utils/storybook";

type StoryProps = PropsWithChildren<{
  highlighted: boolean;
  accountType: MockAccountType;
  balance: number;
  label: string;
  rightElement: "select" | "cta";
}>;

const argTypes: Partial<ArgTypes<StoryProps>> = {
  highlighted: { control: { type: "boolean" } },
  balance: { control: { type: "number" }, description: "(-1 for undefined)" },
  accountType: {
    options: mockAccountTypes,
    control: { type: "select" },
  },
  rightElement: { table: { disable: true } },
  children: { table: { disable: true } },
};

const defaultArgs = {
  label: "Account",
  balance: 1,
  accountType: "mnemonic" as const,
  highlighted: true,
  children: "select",
};

const meta: Meta<StoryProps> = {
  component: AccountTile as any,
  title: "AccountTile",
  argTypes,
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
  render: ({ highlighted, label, balance, accountType, rightElement }) => {
    const color = useColor();
    const store = makeStore();

    const account = mockAccount({ label, balance, accountType, store });

    let children: ReactNode;
    switch (rightElement) {
      case "select": {
        children = (
          <IconButton
            alignSelf="center"
            width="fit-content"
            marginLeft="auto"
            aria-label="Account Selector"
            icon={<SelectorIcon color={color("400")} />}
            size="xs"
            variant="empty"
          />
        );
        break;
      }
      case "cta": {
        children = (
          <Flex justifyContent="center" flexDirection="column" gap="2px">
            <IconButton
              alignSelf="flex-end"
              color={color("500")}
              background="transparent"
              aria-label="Account actions"
              icon={<ThreeDotsIcon />}
              onClick={event => event.stopPropagation()}
              size="xs"
            />

            <Text color={color("700")} size="sm">
              {balance > -1 ? prettyTezAmount(String(balance)) : "\u00A0"}
            </Text>
          </Flex>
        );
      }
    }

    return (
      <Provider store={store}>
        <AccountTile
          width="full"
          minWidth="300px"
          background={highlighted ? color("50") : undefined}
          account={account}
          onClick={noop}
        >
          {children}
        </AccountTile>
      </Provider>
    );
  },
};
export default meta;

export const WithSelectIcon: StoryObj<StoryProps> = {
  args: {
    ...defaultArgs,
    rightElement: "select",
  },
};

export const WithActionAndBalance: StoryObj<StoryProps> = {
  args: {
    ...defaultArgs,
    rightElement: "cta",
  },
};
