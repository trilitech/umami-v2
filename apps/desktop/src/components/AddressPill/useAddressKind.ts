import { useGetTokenType, useSelectedNetwork } from "@umami/state";
import { type Address } from "@umami/tezos";

import {
  type AddressKind,
  type FA12Address,
  type FA2Address,
  type OwnedImplicitAddress,
} from "./types";
import { type OwnedMultisigAddress } from "../AddressTile/types";
import {
  useOwnedAccountAddressKind as useAddressTileOwnedAccountAddressKind,
  useBakerAddressKind,
  useContactAddressKind,
} from "../AddressTile/useAddressKind";

export const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const token = useTokenAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || token || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

const useOwnedAccountAddressKind = (
  address: Address
): OwnedImplicitAddress | OwnedMultisigAddress | null => {
  const addressTileAddressKind = useAddressTileOwnedAccountAddressKind(address);
  if (!addressTileAddressKind) {
    return null;
  }
  const { pkh, label } = addressTileAddressKind;

  return {
    type: addressTileAddressKind.type === "multisig" ? "multisig" : "implicit",
    pkh,
    label,
  };
};

const useTokenAddressKind = ({ pkh }: Address): FA12Address | FA2Address | null => {
  const network = useSelectedNetwork();
  const getTokenType = useGetTokenType(network);
  const tokenType = getTokenType(pkh);
  if (!tokenType) {
    return null;
  }
  switch (tokenType) {
    case "fa1.2":
      return {
        pkh,
        type: "fa1.2",
        label: null,
      };
    case "fa2":
    case "nft":
      return {
        pkh,
        type: "fa2",
        label: null,
      };
  }
};
