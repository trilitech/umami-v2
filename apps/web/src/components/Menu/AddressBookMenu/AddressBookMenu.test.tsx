import { useSortedContacts } from "@umami/state";
import { getButtonByName } from "@umami/test-utils";

import { AddressBookMenu } from "./AddressBookMenu";
import { renderInDrawer, screen } from "../../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useSortedContacts: jest.fn(),
}));

describe("<AddressBookMenu />", () => {
  beforeEach(() => {
    jest.mocked(useSortedContacts).mockReturnValue([
      {
        name: "randomName",
        pkh: "randomPkh",
      },
    ]);
  });

  it('renders the "More Options" button with the correct aria-label and title', async () => {
    await renderInDrawer(<AddressBookMenu />);
    expect(getButtonByName("More Options")).toBeVisible();
    expect(screen.getByLabelText("More Options")).toBeVisible();
  });
});
