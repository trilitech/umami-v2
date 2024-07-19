import { PrettyNumber } from "./PrettyNumber";
import { render, screen } from "../../testUtils";

describe("<PrettyNumber />", () => {
  it("displays tez amount", () => {
    render(<PrettyNumber number="123.4567" />);

    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText(".4567")).toBeInTheDocument();
  });

  it("displays decimals for whole number", () => {
    render(<PrettyNumber number="2000000" />);

    expect(screen.getByText("2000000")).toBeInTheDocument();
    expect(screen.queryByText(".")).not.toBeInTheDocument();
  });
});
