import React from "react";
import { AccountType } from "../../../../types/Account";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTileDisplay";
import { getIcon } from "../../../AccountTile/getIcon";
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
  kind:
    | AccountType.LEDGER
    | AccountType.MNEMONIC
    | AccountType.SOCIAL
    | "contact"
    | "unknownContact";
}> = ({ pkh, label, isLoading = false, kind, ...rest }) => {
  return (
    <AccountTileBase
      icon={getIcon(kind, pkh)}
      leftElement={<LabelAndAddress label={label} pkh={pkh} />}
      rightElement={<MultisigActionButton isLoading={isLoading} {...rest} />}
    />
  );
};
