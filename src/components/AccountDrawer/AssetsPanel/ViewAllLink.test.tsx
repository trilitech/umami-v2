import { ViewAllLink } from "./ViewAllLink";
import { render, screen } from "../../../mocks/testUtils";

describe("<ViewAllLink />", () => {
  it("navigates to the provided route", () => {
    render(<ViewAllLink to="/operations" />);
    expect(screen.getByText("View All").closest("a")).toHaveAttribute("href", "#/operations");
  });
});
