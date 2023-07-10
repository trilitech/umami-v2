import { Address } from "../../types/Address";
import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { useGetOwnedAccountSafe } from "../../utils/hooks/accountHooks";
import { AccountType } from "../../types/Account";
import { useGetBaker, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import {
  AddressKind,
  BakerAddress,
  ContactAddress,
  FA12Address,
  FA2Address,
  OwnedImplicitAccountAddress,
  OwnedMultisigAccountAddress,
} from "./types";
import { useGetTokenType } from "../../utils/hooks/tokensHooks";

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
}: Address): OwnedImplicitAccountAddress | OwnedMultisigAccountAddress | null => {
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

const useBakerAddressKind = ({ pkh }: Address): BakerAddress | null => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);
  if (!baker) {
    return null;
  }
  return {
    pkh,
    type: "baker",
    label: baker.name,
  };
};

const useContactAddressKind = ({ pkh }: Address): ContactAddress | null => {
  const getContactName = useGetContactName();
  const contactName = getContactName(pkh);
  if (!contactName) {
    return null;
  }
  return {
    pkh,
    type: "contact",
    label: contactName,
  };
};
