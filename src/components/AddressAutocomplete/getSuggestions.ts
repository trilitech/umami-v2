import { Contact } from "../../types/Contact";

export const getSuggestions = (inputValue: string, contacts: Contact[]): Contact[] =>
  contacts.filter(
    contact =>
      !inputValue.trim() || contact.name.toLowerCase().includes(inputValue.trim().toLowerCase())
  );
