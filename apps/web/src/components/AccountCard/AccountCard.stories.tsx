import { Box } from "@chakra-ui/react";
import { type ArgTypes, type Meta, type StoryObj } from "@storybook/react";
import { accountsActions, assetsActions, makeStore } from "@umami/state";
import { Provider } from "react-redux";

import { AccountCard } from "./AccountCard";
import { type MockAccountType, mockAccount, mockAccountTypes } from "../../utils/storybook";

type StoryProps = {
  accountType: MockAccountType;
  balance: number;
  label: string;
};

const defaultArgs = {
  label: "Account",
  balance: 1,
  accountType: "mnemonic" as const,
};

const argTypes: Partial<ArgTypes<StoryProps>> = {
  balance: { control: { type: "number" }, description: "(-1 for undefined)" },
  accountType: {
    options: mockAccountTypes,
    control: { type: "select" },
  },
};

const meta: Meta<StoryProps> = {
  component: AccountCard as any,
  title: "AccountCard",
  argTypes,
  parameters: {
    layout: "padded",
  },
  args: defaultArgs,
  render: ({ label, balance, accountType }) => {
    const store = makeStore();

    const account = mockAccount({ label, balance, accountType, store });

    store.dispatch(accountsActions.setCurrent(account.address.pkh));
    store.dispatch(assetsActions.updateConversionRate(2.44));

    return (
      <Provider store={store}>
        <Box width="100%" maxWidth={{ md: "600px" }}>
          <AccountCard />
        </Box>
      </Provider>
    );
  },
};

export default meta;

export const Default: StoryObj<StoryProps> = {};
