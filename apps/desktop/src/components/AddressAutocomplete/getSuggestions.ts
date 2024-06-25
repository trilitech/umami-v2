import { type Contact } from "@umami/core";

export const getSuggestions = (inputValue: string, contacts: Contact[]): Contact[] =>
  contacts.filter(
    contact =>
      !inputValue.trim() || contact.name.toLowerCase().includes(inputValue.trim().toLowerCase())
  );
