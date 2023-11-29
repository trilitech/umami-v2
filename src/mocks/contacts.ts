import { mockContact } from "./factories";
import { Contact } from "../types/Contact";

export const contact1 = mockContact(1);

export const contact2 = mockContact(2);

export const contact3 = mockContact(3);

export const contacts = () => {
  const contacts: Record<string, Contact> = {};
  contacts[contact3["pkh"]] = contact3;
  contacts[contact2["pkh"]] = contact2;
  contacts[contact1["pkh"]] = contact1;
  return contacts;
};
