import { Address } from "../../types/Address";
import { AddressKind, FA12Address, FA2Address, OwnedImplicitAddress } from "./types";
import { useGetTokenType } from "../../utils/hooks/tokensHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { OwnedMultisigAddress } from "../AddressTile/types";
import {
  useBakerAddressKind,
  useContactAddressKind,
  useOwnedAccountAddressKind as useAddressTileOwnedAccountAddressKind,
} from "../AddressTile/useAddressKind";

const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const token = useTokenAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || token || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

export default useAddressKind;

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
