import { Address } from "../../types/Address";
import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { useGetOwnedAccountSafe } from "../../utils/hooks/accountHooks";
import { AccountType } from "../../types/Account";
import { AddressKind, FA12Address, FA2Address, OwnedImplicitAddress } from "./types";
import { useGetTokenType } from "../../utils/hooks/tokensHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { OwnedMultisigAddress } from "../AddressTile/types";
import { useBakerAddressKind, useContactAddressKind } from "../AddressTile/useAddressKind";

const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const token = useTokenAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || token || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

export default useAddressKind;

const useOwnedAccountAddressKind = ({
  pkh,
}: Address): OwnedImplicitAddress | OwnedMultisigAddress | null => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  if (!account) {
    return null;
  }
  switch (account.type) {
    case AccountType.MULTISIG:
      return {
        pkh,
        type: "ownedMultisig",
        label: account.label,
      };
    case AccountType.SOCIAL:
    case AccountType.LEDGER:
    case AccountType.MNEMONIC:
      return {
        pkh,
        type: "ownedImplicit",
        label: account.label,
      };
  }
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
