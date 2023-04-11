import { useAppSelector } from "../store/hooks";
export const useContacts = () => useAppSelector((s) => s.contacts.contacts);

export const useAllSortedContacts = () => {
  const contacts = useContacts();
  return Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name));
};
