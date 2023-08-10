import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

export default {
  title: "Umami/MultisigSignerTileDisplay",
  component: MultisigSignerTileDisplay,
} as ComponentMeta<typeof MultisigSignerTileDisplay>;

const Template: ComponentStory<typeof MultisigSignerTileDisplay> = args => (
  <MultisigSignerTileDisplay {...args} />
);

export const AwaitingApproval = Template.bind({});
AwaitingApproval.args = {
  label: "Multisig signer",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  signerState: "awaitingApprovalByExternalSigner",
};

export const Approved = Template.bind({});
Approved.args = {
  label: "Multisig signer",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  onClickApproveExecute: () => {},
  signerState: "approved",
};

export const Executable = Template.bind({});
Executable.args = {
  label: "Multisig signer",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  onClickApproveExecute: () => {},
  signerState: "executable",
};

export const LoadingExecution = Template.bind({});
LoadingExecution.args = {
  label: "Multisig signer",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  onClickApproveExecute: () => {},
  signerState: "executable",
  isLoading: true,
};

export const Approvable = Template.bind({});
Approvable.args = {
  label: "Multisig signer",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
  onClickApproveExecute: () => {},
  signerState: "approvable",
};
