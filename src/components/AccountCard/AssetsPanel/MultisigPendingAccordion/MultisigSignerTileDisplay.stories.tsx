import { Meta, StoryObj } from "@storybook/react";
import { AccountType } from "../../../../types/Account";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

const meta = {
  title: "Umami/MultisigSignerTileDisplay",
  component: MultisigSignerTileDisplay,
} satisfies Meta<typeof MultisigSignerTileDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

const pkh = "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3";

export const AwaitingApproval: Story = {
  args: {
    label: "Multisig signer",
    pkh,
    signerState: "awaitingApprovalByExternalSigner",
    kind: AccountType.MNEMONIC,
  },
};

export const AwaitingApprovalSocial: Story = {
  args: {
    label: "Multisig signer",
    pkh,
    signerState: "awaitingApprovalByExternalSigner",
    kind: AccountType.SOCIAL,
  },
};

export const AwaitingApprovalContact: Story = {
  args: {
    label: "Multisig signer",
    pkh,
    signerState: "awaitingApprovalByExternalSigner",
    kind: "contact",
  },
};

export const AwaitingApprovalUnknownAddress: Story = {
  args: {
    label: "Multisig signer",
    pkh,
    signerState: "awaitingApprovalByExternalSigner",
    kind: "unknown",
  },
};

export const Approved = {
  args: {
    label: "Multisig signer",
    pkh,
    onClickApproveExecute: () => {},
    signerState: "approved",
    kind: AccountType.MNEMONIC,
  },
};

export const Executable = {
  args: {
    label: "Multisig signer",
    pkh,
    onClickApproveExecute: () => {},
    signerState: "executable",
    kind: AccountType.MNEMONIC,
  },
};

export const LoadingExecution = {
  args: {
    label: "Multisig signer",
    pkh,
    onClickApproveExecute: () => {},
    signerState: "executable",
    isLoading: true,
    kind: AccountType.MNEMONIC,
  },
};

export const Approvable = {
  args: {
    label: "Multisig signer",
    pkh,
    onClickApproveExecute: () => {},
    signerState: "approvable",
    kind: AccountType.MNEMONIC,
  },
};
