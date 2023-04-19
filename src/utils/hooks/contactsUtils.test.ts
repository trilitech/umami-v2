import { nameExistsInContacts } from "./contactsUtils";
import { contact1 } from "../../mocks/contacts";

describe("nameExistsInContacts", () => {
  test("nameExistsInContacts returns the right value", () => {
    expect(nameExistsInContacts({}, "myname")).toEqual(false);
    expect(
      nameExistsInContacts({ [contact1.pkh]: contact1 }, contact1.name)
    ).toEqual(true);
  });
});
