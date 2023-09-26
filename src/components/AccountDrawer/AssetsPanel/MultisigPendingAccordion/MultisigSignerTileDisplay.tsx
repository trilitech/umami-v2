import React from "react";
import { AccountType } from "../../../../types/Account";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTileDisplay";
import MultisigActionButton, { MultisigSignerState } from "./MultisigActionButton";
import { AddressKind } from "../../../AddressTile/types";
import AccountTileIcon from "../../../AccountTile/AccountTileIcon";

export const MultisigSignerTileDisplay: React.FC<{
  onClickApproveExecute: () => void;
  signerState: MultisigSignerState;
  isLoading: boolean;
  addressKind: Exclude<AddressKind, AccountType.MULTISIG>;
}> = ({ isLoading, addressKind, ...rest }) => {
  return (
    <AccountTileBase
      icon={<AccountTileIcon addressKind={addressKind} />}
      leftElement={<LabelAndAddress label={addressKind.label} pkh={addressKind.pkh} />}
      rightElement={<MultisigActionButton isLoading={isLoading} {...rest} />}
    />
  );
};
