import React from "react";

import { MultisigActionButton, MultisigSignerState } from "./MultisigActionButton";
import { AccountTileBase, LabelAndAddress } from "../../../AccountTile/AccountTile";
import { AccountTileIcon } from "../../../AccountTile/AccountTileIcon";
import { AddressKind } from "../../../AddressTile/types";

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
