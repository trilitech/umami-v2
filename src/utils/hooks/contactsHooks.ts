import { useGetOwnedAccountSafe } from "./getAccountDataHooks";
import { useSelectedNetwork } from "./networkHooks";
import { isAddressValid, isValidImplicitPkh } from "../../types/Address";
import { Contact } from "../../types/Contact";
import { useAppSelector } from "../redux/hooks";

export const useAllContacts = () => useAppSelector(s => s.contacts);

export const useContactsForSelectedNetwork = () => {
  const network = useSelectedNetwork();
  const allContacts = useAllContacts();

  return Object.values(allContacts)
    .filter(contact => isValidImplicitPkh(contact.pkh) || contact.network === network.name)
    .map(contact => contact as Contact);
};

export const useSortedContacts = () => {
  const contactsForSelectedNetwork = useContactsForSelectedNetwork();

  return contactsForSelectedNetwork
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(contact => contact as Contact);
};

export const useAddressExistsInContacts = () => {
  const contacts = useAllContacts();
  return (pkh: string) => pkh in contacts;
};

export const useGetContactName = () => {
  const contacts = useAllContacts();

  return (pkh: string) => (pkh in contacts ? contacts[pkh].name : undefined);
};

export const useValidateNewContactPkh = () => {
  const addressExistsInContacts = useAddressExistsInContacts();
  const getAccount = useGetOwnedAccountSafe();

  return (pkh: string) => {
    if (!isAddressValid(pkh)) {
      return "Invalid address";
    }
    if (getAccount(pkh)) {
      return "Address is already used in accounts";
    }
    return !addressExistsInContacts(pkh) || "Address is already registered";
  };
};
