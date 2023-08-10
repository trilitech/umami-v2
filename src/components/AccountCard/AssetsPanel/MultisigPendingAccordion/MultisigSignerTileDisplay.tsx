import React from "react";
import { AccountTileBase, LabelAndAdress } from "../../../AccountTile/AccountTileDisplay";
import { Identicon } from "../../../Identicon";
import MultisigActionButton from "./MultisigActionButton";

export type MultisigSignerState =
  | "awaitingApprovalByExternalSigner"
  | "approved"
  | "executable"
  | "approvable";

export const MultisigSignerTileDisplay: React.FC<{
  pkh: string;
  label?: string;
  onClickApproveExecute: () => void;
  signerState: MultisigSignerState;
  isLoading?: boolean;
}> = ({ pkh, label, isLoading = false, ...rest }) => (
  <AccountTileBase
    icon={<Identicon address={pkh} />}
    leftElement={<LabelAndAdress label={label} pkh={pkh} />}
    rightElement={<MultisigActionButton isLoading={isLoading} {...rest} />}
  />
);
