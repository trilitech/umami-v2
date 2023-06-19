import { render, screen } from "@testing-library/react";
import { TruncatedTextWithTooltip } from "./TruncatedTextWithTooltip";

describe("TruncatedTextWithTooltip", () => {
  it("renders just text if the input is short enough", () => {
    render(<TruncatedTextWithTooltip text="123" maxLength={10} />);
    expect(screen.getByTestId("truncated-text")).toHaveTextContent("123");
    expect(screen.getByTestId("truncated-text")).not.toHaveTextContent("...");
  });

  it("renders shortened text and a tooltip if the input large", () => {
    render(<TruncatedTextWithTooltip text="some text" maxLength={5} />);
    expect(screen.getByTestId("truncated-text")).toHaveTextContent("so...");
  });
});
