import { Card, Icon } from "@chakra-ui/react";
import { type ArgTypes, type Meta, type StoryObj } from "@storybook/react";
import { type FA2Token, type NFT } from "@umami/core";
import { makeStore } from "@umami/state";
import { mockContractAddress, mockImplicitAddress } from "@umami/tezos";
import { type ComponentProps } from "react";
import { Provider } from "react-redux";

import { ContractCallTileTitle } from "./ContractCallTile";
import { DelegationTileTitle } from "./DelegationTile";
import { FinalizeUnstakeTileTitle } from "./FinalizeUnstakeTile";
import { OperationTileView } from "./OperationTileView";
import { OriginationTileTitle } from "./OriginationTile";
import { StakeTileTitle } from "./StakeTile";
import { TokenTransferTileTitle } from "./TokenTransferTile";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TransactionTileTitle } from "./TransactionTile";
import { UnstakeTileTitle } from "./UnstakeTile";
import { ContractIcon, DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

type StoryProps = ComponentProps<typeof OperationTileView>;

type Story = StoryObj<StoryProps>;

const argTypes: Partial<ArgTypes<StoryProps>> = {
  status: {
    options: ["applied", "pending", "failed"],
    table: { type: { summary: "applied | pending | failed" } },
    control: { type: "radio" },
  },
  destination: {
    options: ["incoming", "outgoing", "unrelated"],
    table: { type: { summary: "incoming | outgoing | unrelated" } },
    control: { type: "radio", labels: { unrelated: "internal" } },
  },
  timestamp: { table: { type: { summary: "timestamp" } }, control: { type: "date" } },
  fee: { table: { type: { summary: "number (Mutez)" } }, control: { type: "number" } },
  title: { table: { disable: true } },
  from: { table: { disable: true } },
  to: { table: { disable: true } },
  operationType: { table: { disable: true } },
  icon: { table: { disable: true } },
};

const defaultArgs = {
  status: "applied" as const,
  destination: "incoming" as const,
  from: mockImplicitAddress(0),
  timestamp: "2021-01-02T00:00:00.000Z",
  fee: 5316,
};

const meta: Meta<StoryProps> = {
  component: OperationTileView,
  title: "OperationTile",
  parameters: { layout: "padded" },
  argTypes,
  args: defaultArgs,
  decorators: [
    Story => (
      <Provider store={makeStore()}>
        <Card padding="20px" background="white">
          <Story />
        </Card>
      </Provider>
    ),
  ],
};

export default meta;

export const TezTransfer: Story = {
  args: {
    operationType: "Transaction",
    to: mockImplicitAddress(1),
  },
  render: props => {
    const { destination } = props;
    const title = (
      <TransactionTileTitle amount={1} counter={1} destination={destination} hash="test-hash" />
    );
    const icon = <TransactionDirectionIcon marginRight="8px" destination={destination} />;
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const TokenTransfer: StoryObj<StoryProps & { amount: string }> = {
  args: {
    operationType: "Token Transfer",
    to: mockImplicitAddress(1),
    amount: "1.00124",
  },
  argTypes: {
    ...argTypes,
    amount: { table: { type: { summary: "string" } }, control: { type: "text" } },
  },
  render: ({ amount, ...props }) => {
    const { destination } = props;
    const title = (
      <TokenTransferTileTitle
        amount={amount}
        destination={destination}
        token={{ type: "fa2" } as FA2Token}
      />
    );
    const icon = <TransactionDirectionIcon marginRight="8px" destination={destination} />;
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const NFT_Transfer: StoryObj<StoryProps & { amount: string; uri: string }> = {
  args: {
    operationType: "Token Transfer",
    to: mockImplicitAddress(1),
    amount: "1.00124",
    uri: "ipfs://QmVhgnkY9G6yT4BhHKbwQg9gyCzWF7fFeDM4YTyttXWJpt",
  },
  argTypes: {
    ...argTypes,
    amount: { table: { type: { summary: "string" } }, control: { type: "text" } },
    uri: { table: { type: { summary: "string" } }, control: { type: "text" } },
  },
  render: ({ amount, uri, ...props }) => {
    const { destination } = props;
    const title = (
      <TokenTransferTileTitle
        amount={amount}
        destination={destination}
        token={
          {
            type: "nft",
            displayUri: uri,
            metadata: {
              decimals: "0",
              name: "Test NFT",
              artifactUri: uri,
            },
          } as NFT
        }
      />
    );
    const icon = <TransactionDirectionIcon marginRight="8px" destination={destination} />;
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const ContractCall: StoryObj<StoryProps & { entrypoint: string }> = {
  args: {
    operationType: "Contract Call",
    to: mockContractAddress(1),
    entrypoint: "test-entrypoint",
  },
  argTypes: {
    ...argTypes,
    entrypoint: { table: { type: { summary: "string" } }, control: { type: "text" } },
    destination: { table: { disable: true } },
  },
  render: ({ entrypoint, ...props }) => {
    const color = useColor();
    const title = <ContractCallTileTitle counter={1} entrypoint={entrypoint} hash="test-hash" />;
    const icon = (
      <Icon as={ContractIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const Delegation: StoryObj<StoryProps> = {
  args: {
    operationType: "Delegate",
    to: mockImplicitAddress(1),
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
  },
  render: props => {
    const color = useColor();
    const title = <DelegationTileTitle counter={1} hash="test-hash" operationType="Delegate" />;
    const icon = (
      <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const Undelegation: StoryObj<StoryProps> = {
  args: {
    operationType: "Delegate",
    to: mockImplicitAddress(1),
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
  },
  render: props => {
    const color = useColor();
    const title = (
      <DelegationTileTitle counter={1} hash="test-hash" operationType="Delegation Ended" />
    );
    const icon = (
      <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const ContractOrigination: StoryObj<StoryProps> = {
  args: {
    operationType: "Contract Origination",
    to: mockImplicitAddress(1),
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
  },
  render: props => {
    const color = useColor();
    const title = (
      <OriginationTileTitle counter={1} hash="test-hash" operationType="Contract Origination" />
    );
    const icon = (
      <Icon as={ContractIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const MultisigAccountOrigination: StoryObj<StoryProps> = {
  args: {
    operationType: "Contract Origination",
    to: mockImplicitAddress(1),
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
  },
  render: props => {
    const color = useColor();
    const title = (
      <OriginationTileTitle counter={1} hash="test-hash" operationType="Multisig Account Created" />
    );
    const icon = (
      <Icon as={ContractIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const Stake: StoryObj<StoryProps & { amount: string }> = {
  args: {
    operationType: "Stake",
    to: mockImplicitAddress(1),
    amount: "1.00124",
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
    amount: { table: { type: { summary: "string" } }, control: { type: "text" } },
  },
  render: ({ amount, ...props }) => {
    const color = useColor();
    const title = <StakeTileTitle amount={amount} counter={1} hash="test-hash" />;
    const icon = (
      <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const Unstake: StoryObj<StoryProps & { amount: string }> = {
  args: {
    operationType: "Unstake",
    to: mockImplicitAddress(1),
    amount: "1.00124",
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
    amount: { table: { type: { summary: "string" } }, control: { type: "text" } },
  },
  render: ({ amount, ...props }) => {
    const color = useColor();
    const title = <UnstakeTileTitle amount={amount} counter={1} hash="test-hash" />;
    const icon = (
      <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};

export const FinalizeUnstake: StoryObj<StoryProps & { amount: string }> = {
  args: {
    operationType: "Finalize Unstake",
    to: mockImplicitAddress(1),
    amount: "1.00124",
  },
  argTypes: {
    ...argTypes,
    destination: { table: { disable: true } },
    amount: { table: { type: { summary: "string" } }, control: { type: "text" } },
  },
  render: ({ amount, ...props }) => {
    const color = useColor();
    const title = <FinalizeUnstakeTileTitle amount={amount} counter={1} hash="test-hash" />;
    const icon = (
      <Icon as={DelegateIcon} width="22px" height="22px" marginRight="8px" color={color("400")} />
    );
    return <OperationTileView {...props} icon={icon} title={title} />;
  },
};
