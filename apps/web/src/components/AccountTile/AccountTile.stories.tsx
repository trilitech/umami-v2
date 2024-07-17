import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { type ArgTypes, type Meta, type StoryObj } from "@storybook/react";
import {
  type Account,
  type ImplicitAccount,
  mockImplicitAccount,
  mockSocialAccount,
} from "@umami/core";
import { type IDP } from "@umami/social-auth";
import { assetsActions, makeStore } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { type RawTzktAccount } from "@umami/tzkt";
import { noop } from "lodash";
import { type PropsWithChildren, type ReactNode } from "react";
import { Provider } from "react-redux";

import { AccountTile } from "./AccountTile";
import { ChevronDownIcon, ThreeDotsIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

type StoryProps = PropsWithChildren<{
  highlighted: boolean;
  accountType: string;
  balance: number;
  label: string;
  rightElement: "chevron" | "cta";
}>;

const argTypes: Partial<ArgTypes<StoryProps>> = {
  highlighted: { control: { type: "boolean" } },
  balance: { control: { type: "number" } },
  accountType: {
    options: [
      "mnemonic",
      "ledger",
      "secret_key",
      "social_google",
      "social_facebook",
      "social_twitter",
      "social_reddit",
      "social_email",
    ],
    control: { type: "select" },
  },
  children: { table: { disable: true } },
};

const defaultArgs = {
  label: "Account",
  balance: 1,
  accountType: "mnemonic",
  highlighted: true,
  children: "chevron",
};

const meta: Meta<StoryProps> = {
  component: AccountTile as any,
  title: "AccountTile",
  argTypes,
  decorators: [
    Story => {
      const color = useColor();

      return (
        <Box padding="40px" background={color("white")}>
          <Story />
        </Box>
      );
    },
  ],
  args: defaultArgs,
  render: ({ highlighted, label, balance, accountType, rightElement }) => {
    const color = useColor();
    const store = makeStore();
    let account: Account;
    if (accountType.includes("social")) {
      const [_, idp] = accountType.split("_");
      account = mockSocialAccount(0, label, idp as IDP);
    } else {
      account = mockImplicitAccount(0, accountType as ImplicitAccount["type"], "", label);
    }

    store.dispatch(
      assetsActions.updateAccountStates([
        { address: account.address.pkh, balance } as RawTzktAccount,
      ])
    );

    let children: ReactNode;
    switch (rightElement) {
      case "chevron": {
        children = (
          <IconButton
            alignSelf="center"
            width="fit-content"
            marginLeft="auto"
            aria-label="Account Selector"
            icon={<ChevronDownIcon color="gray.500" />}
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
              color="gray.500"
              background="transparent"
              aria-label="Account actions"
              icon={<ThreeDotsIcon />}
              onClick={event => event.stopPropagation()}
              size="xs"
            />

            <Text color="gray.700" size="sm">
              {prettyTezAmount("500")}
            </Text>
          </Flex>
        );
      }
    }

    return (
      <Provider store={store}>
        <AccountTile
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

export const WithChevron: StoryObj<StoryProps> = {
  args: {
    ...defaultArgs,
    rightElement: "chevron",
  },
};

export const WithActionAndBalance: StoryObj<StoryProps> = {
  args: {
    ...defaultArgs,
    rightElement: "cta",
  },
};
