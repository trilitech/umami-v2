import { Contact } from "../types/Contact";
import { mockPkh } from "./factories";

export const contact1 = {
  name: "Lewis Hatfull",
  pkh: mockPkh(0),
};
export const contact2 = {
  name: "Lev Kowalski",
  pkh: mockPkh(1),
};
export const contact3 = {
  name: "Abhishek Jain",
  pkh: mockPkh(2),
};

export const contacts = () => {
  const contacts: Record<string, Contact> = {};
  contacts[contact1["pkh"]] = contact1;
  contacts[contact2["pkh"]] = contact2;
  contacts[contact3["pkh"]] = contact3;
  return contacts;
};
