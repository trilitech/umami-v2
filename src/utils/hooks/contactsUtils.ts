import { Contact } from "../../types/Contact";

export const nameExistsInContacts = (contacts: Record<string, Contact>, name: string) =>
  Object.values(contacts)
    .map(c => c.name)
    .includes(name);
