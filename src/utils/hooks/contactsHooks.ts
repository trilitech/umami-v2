import { useAppSelector } from "../store/hooks";
import { nameExistsInContacts } from "./contactsUtils";
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

export const useGetContactName = (): ((pkh: string) => string | undefined) => {
  const contacts = useContacts();
  return (pkh: string) => contacts[pkh]?.name;
};
