import type { Meta, StoryObj } from "@storybook/react";
import { mockMultisigAccount } from "@umami/core";
import {
  addTestAccount,
  assetsActions,
  contactsActions,
  makeStore,
  tokensActions,
} from "@umami/state";
import { hedgehoge, uUSD } from "@umami/test-utils";
import {
  type Address,
  MAINNET,
  mockContractAddress,
  mockImplicitAddress,
  parsePkh,
} from "@umami/tezos";
import { Provider } from "react-redux";

import { AddressPill } from "./AddressPill";
import { dark, light } from "../../styles/colors";

const meta: Meta<typeof AddressPill> = {
  component: AddressPill,
  title: "AddressPill",
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: light.grey.white,
        },
        {
          name: "dark",
          value: dark.grey.white,
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AddressPill>;

const implicitAddress: Address = {
  type: "implicit",
  pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
};
const multisigAddress: Address = mockMultisigAccount(0).address;

const network = MAINNET;

export const OwnedAccount: Story = {
  args: {
    address: implicitAddress,
    mode: "no_icons",
  },
  decorators: Story => (
    <Provider store={makeStore()}>
      <Story />
    </Provider>
  ),
};

export const MultisigAccount: Story = {
  args: {
    address: multisigAddress,
  },
  decorators: Story => {
    const store = makeStore();

    addTestAccount(store, mockMultisigAccount(0));
    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const FromContacts: Story = {
  args: {
    address: implicitAddress,
  },
  decorators: Story => {
    const store = makeStore();
    store.dispatch(
      contactsActions.upsert({
        name: "Test Contact",
        network: network.name,
        pkh: implicitAddress.pkh,
      })
    );
    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const UnknownImplicit: Story = {
  args: {
    address: implicitAddress,
  },
  decorators: Story => (
    <Provider store={makeStore()}>
      <Story />
    </Provider>
  ),
};

export const UnknownContract: Story = {
  args: {
    address: mockContractAddress(0),
  },
  decorators: Story => (
    <Provider store={makeStore()}>
      <Story />
    </Provider>
  ),
};

export const Baker: Story = {
  args: {
    address: implicitAddress,
  },
  decorators: Story => {
    const store = makeStore();
    store.dispatch(
      assetsActions.updateBakers([
        { address: implicitAddress.pkh, name: "Test Baker", stakingBalance: 0 },
      ])
    );
    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const UnknownFA2: Story = {
  args: {
    address: parsePkh("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo"),
  },
  decorators: Story => {
    const store = makeStore();
    const tokenBalance = uUSD(mockImplicitAddress(0));
    store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const FA2FromContacts: Story = {
  args: {
    address: parsePkh("KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo"),
  },
  decorators: Story => {
    const store = makeStore();
    const tokenBalance = uUSD(mockImplicitAddress(0));
    store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
    store.dispatch(
      contactsActions.upsert({
        name: "Known FA2 contract",
        network: network.name,
        pkh: tokenBalance.token.contract.address,
      })
    );

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const UnknownFA12: Story = {
  args: {
    address: parsePkh("KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9"),
  },
  decorators: Story => {
    const store = makeStore();
    const tokenBalance = hedgehoge(mockImplicitAddress(0));
    store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};

export const FA12FromContacts: Story = {
  args: {
    address: parsePkh("KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9"),
  },
  decorators: Story => {
    const store = makeStore();
    const tokenBalance = hedgehoge(mockImplicitAddress(0));
    store.dispatch(tokensActions.addTokens({ network, tokens: [tokenBalance.token] }));
    store.dispatch(
      contactsActions.upsert({
        name: "Known FA1.2 contract",
        network: network.name,
        pkh: tokenBalance.token.contract.address,
      })
    );

    return (
      <Provider store={store}>
        <Story />
      </Provider>
    );
  },
};
