import { Contact } from "../types/Contact";
import { mockImplicitAddress } from "./factories";

export const contact1 = {
  name: "Lewis Hatfull",
  pkh: mockImplicitAddress(0).pkh,
};

export const contact2 = {
  name: "Lev Kowalski",
  pkh: mockImplicitAddress(1).pkh,
};

export const contact3 = {
  name: "Abhishek Jain",
  pkh: mockImplicitAddress(2).pkh,
};

export const contacts = () => {
  const contacts: Record<string, Contact> = {};
  contacts[contact1["pkh"]] = contact1;
  contacts[contact2["pkh"]] = contact2;
  contacts[contact3["pkh"]] = contact3;
  return contacts;
};
