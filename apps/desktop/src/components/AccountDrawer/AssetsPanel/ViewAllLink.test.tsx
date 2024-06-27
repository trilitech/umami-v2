import { mockImplicitAddress } from "@umami/tezos";

import { ViewAllLink } from "./ViewAllLink";
import { render, screen } from "../../../mocks/testUtils";

describe("<ViewAllLink />", () => {
  it("navigates to the provided route", () => {
    const ownerAddress = mockImplicitAddress(1).pkh;

    render(<ViewAllLink owner={ownerAddress} to="/operations" />);

    expect(screen.getByText("View All").closest("a")).toHaveAttribute(
      "href",
      `#/operations?accounts=${ownerAddress}`
    );
  });
});
