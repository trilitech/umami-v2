import { useAppSelector } from "../store/hooks";
export const useContacts = () => useAppSelector((s) => s.contacts);

export const useAllSortedContacts = () => {
  const contacts = useContacts();
  return Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name));
};

export const useContactAlreadyExists = () => {
  const contacts = useContacts();
  return (pkh: string) => pkh in contacts;
};

export const useGetNameFromAddress = (): ((pkh: string) => string | null) => {
  const contacts = useContacts();
  return (pkh: string) => contacts[pkh]?.name;
};
