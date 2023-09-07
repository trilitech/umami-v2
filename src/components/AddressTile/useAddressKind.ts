import { AccountType } from "../../types/Account";
import { Address } from "../../types/Address";
import { useGetOwnedAccountSafe } from "../../utils/hooks/accountHooks";
import { useGetBaker } from "../../utils/hooks/assetsHooks";
import { useGetContactName } from "../../utils/hooks/contactsHooks";
import { AddressKind, AddressKindType, BakerAddress, ContactAddress, OwnedAddreess } from "./types";

const useAddressKind = (address: Address): AddressKind => {
  const ownedAccount = useOwnedAccountAddressKind(address);

  const baker = useBakerAddressKind(address);

  const contact = useContactAddressKind(address);

  const known = ownedAccount || baker || contact;

  return known || { pkh: address.pkh, type: "unknown", label: null };
};

export default useAddressKind;

const useOwnedAccountAddressKind = ({ pkh }: Address): OwnedAddreess | null => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  if (!account) {
    return null;
  }

  let type: AddressKindType;
  switch (account.type) {
    case AccountType.MULTISIG:
      type = "ownedMultisig";
      break;
    case AccountType.SOCIAL:
      type = "social";
      break;
    case AccountType.LEDGER:
      type = "ledger";
      break;
    case AccountType.MNEMONIC:
      type = "mnemonic";
      break;
  }

  return {
    type,
    pkh,
    label: account.label,
  };
};

export const useBakerAddressKind = ({ pkh }: Address): BakerAddress | null => {
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
