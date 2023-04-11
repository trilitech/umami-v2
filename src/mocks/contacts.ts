import { Contact } from "../types/AddressBook";

export const contact1 = {
  name: "Lewis Hatfull",
  pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
};
export const contact2 = {
  name: "Lev Kowalski",
  pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
};
export const contact3 = {
  name: "Abhishek Jain",
  pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
};

export const contacts = () => {
  const contacts: Record<string, Contact> = {};
  contacts[contact1["pkh"]] = contact1;
  contacts[contact2["pkh"]] = contact2;
  contacts[contact3["pkh"]] = contact3;
  return contacts;
};
