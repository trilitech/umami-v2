import { nameExistsInContacts } from "./contactsUtils";
import { useAppSelector } from "../redux/hooks";
export const useContacts = () => useAppSelector(s => s.contacts);

export const useAllSortedContacts = () => {
  const contacts = useContacts();
  return Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name));
};

export const useContactExists = () => {
  const contacts = useContacts();
  return {
    addressExistsInContacts: (pkh: string) => pkh in contacts,
    nameExistsInContacts: (name: string) => nameExistsInContacts(contacts, name),
  };
};

export const useGetContactName = () => {
  const contacts = useContacts();
  return (pkh: string) => (pkh in contacts ? contacts[pkh].name : undefined);
};
