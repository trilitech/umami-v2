import { mockContractContact, mockImplicitContact } from "./factories";
import { StoredContactInfo } from "../types/Contact";

export const contact1 = mockImplicitContact(1);
export const contact2 = mockImplicitContact(2);
export const contact3 = mockImplicitContact(3);

export const ghostnetContact = mockContractContact(1, "ghostnet", "Ghostnet Contact");
export const mainnetContact = mockContractContact(2, "mainnet", "Mainnet Contact");

export const contacts = () => {
  const contacts: Record<string, StoredContactInfo> = {};
  contacts[contact3["pkh"]] = contact3;
  contacts[contact2["pkh"]] = contact2;
  contacts[contact1["pkh"]] = contact1;
  return contacts;
};
