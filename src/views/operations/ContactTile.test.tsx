import { render, screen } from "@testing-library/react";
import { contact1 } from "../../mocks/contacts";
import { ReduxStore } from "../../providers/ReduxStore";
import { formatPkh, truncate } from "../../utils/format";
import ContactTile from "./ContactTile";

const fixture = (
  pkh: string,
  getNameFromAddress: (pkh: string) => string | null
) => {
  return (
    <ReduxStore>
      <ContactTile pkh={pkh} getNameFromAddress={getNameFromAddress} />
    </ReduxStore>
  );
};

describe("ContactTile", () => {
  it("displays the address if it is not in the contacts", () => {
    render(fixture(contact1["pkh"], () => null));
    expect(screen.queryByTestId("contact-tile")).toHaveTextContent(
      formatPkh(contact1["pkh"])
    );
  });
  it("displays the name if it is in the contacts", () => {
    render(fixture(contact1["pkh"], () => contact1["name"]));
    expect(screen.queryByTestId("contact-tile")).toHaveTextContent(
      truncate(contact1["name"], 20)
    );
  });
});
