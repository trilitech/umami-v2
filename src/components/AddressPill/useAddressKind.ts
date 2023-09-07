import { Address } from "../../types/Address";
import {
  AddressKind,
  AddressKindType,
  FA12Address,
  FA2Address,
  OwnedImplicitAddress,
} from "./types";
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
  const addressTileAddrssKind = useAddressTileOwnedAccountAddressKind(address);
  if (!addressTileAddrssKind) {
    return null;
  }
  const { pkh, label } = addressTileAddrssKind;

  let type: AddressKindType;
  switch (addressTileAddrssKind.type) {
    case "ownedMultisig":
      type = "ownedMultisig";
      break;
    case "social":
    case "ledger":
    case "mnemonic":
      type = "ownedImplicit";
  }

  return {
    type,
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
