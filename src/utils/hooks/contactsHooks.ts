import { useGetOwnedAccountSafe } from "./getAccountDataHooks";
import { isAddressValid } from "../../types/Address";
import { useAppSelector } from "../redux/hooks";

export const useContacts = () => useAppSelector(s => s.contacts);

export const useAllSortedContacts = () => {
  const contacts = useContacts();
  return Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name));
};

export const useAddressExistsInContacts = () => {
  const contacts = useContacts();
  return (pkh: string) => pkh in contacts;
};

export const useGetContactName = () => {
  const contacts = useContacts();
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
