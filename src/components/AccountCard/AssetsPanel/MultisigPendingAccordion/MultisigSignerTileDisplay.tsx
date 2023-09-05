import React from "react";
import { AccountType } from "../../../../types/Account";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTileDisplay";
import { getIcon } from "../../../AccountTile/getIcon";
import { AddressKind } from "../../../AccountTile/AddressKind";
import MultisigActionButton, { MultisigSignerState } from "./MultisigActionButton";

export const MultisigSignerTileDisplay: React.FC<{
  pkh: string;
  label?: string;
  onClickApproveExecute: () => void;
  signerState: MultisigSignerState;
  isLoading?: boolean;
  kind: Exclude<AddressKind, AccountType.MULTISIG>;
}> = ({ pkh, label, isLoading = false, kind, ...rest }) => {
  return (
    <AccountTileBase
      icon={getIcon(kind, pkh)}
      leftElement={
        <LabelAndAddress
          label={kind === "unknown" ? undefined : label}
          pkh={pkh}
          fullPkh={kind === "unknown"}
        />
      }
      rightElement={<MultisigActionButton isLoading={isLoading} {...rest} />}
    />
  );
};
