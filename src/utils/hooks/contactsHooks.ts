import { useAppSelector } from "../store/hooks";
export const useContacts = () => useAppSelector((s) => s.contacts);

export const useAllSortedContacts = () => {
  const contacts = useContacts();
  return Object.values(contacts).sort((a, b) => a.name.localeCompare(b.name));
};

export const useContactExists = () => {
  const contacts = useContacts();
  return {
    addressExistsInContacts: (pkh: string) => pkh in contacts,
    nameExistsInContacts: (name: string) =>
      Object.values(contacts).find((c) => c.name === name) !== undefined,
  };
};

export const useGetNameFromAddress = (): ((pkh: string) => string | null) => {
  const contacts = useContacts();
  return (pkh: string) => contacts[pkh]?.name;
};
