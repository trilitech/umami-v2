import React from "react";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTile";
import { MultisigActionButton, MultisigSignerState } from "./MultisigActionButton";
import { AddressKind } from "../../../AddressTile/types";
import { AccountTileIcon } from "../../../AccountTile/AccountTileIcon";

export const MultisigSignerTileDisplay: React.FC<{
  onClickApproveExecute: () => void;
  signerState: MultisigSignerState;
  isLoading: boolean;
  addressKind: Exclude<AddressKind, "multisig">;
}> = ({ isLoading, addressKind, ...rest }) => {
  return (
    <AccountTileBase
      icon={<AccountTileIcon addressKind={addressKind} />}
      leftElement={<LabelAndAddress label={addressKind.label} pkh={addressKind.pkh} />}
      rightElement={<MultisigActionButton isLoading={isLoading} {...rest} />}
    />
  );
};
