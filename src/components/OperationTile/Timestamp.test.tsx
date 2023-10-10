import { render, screen } from "../../mocks/testUtils";
import { Timestamp } from "./Timestamp";

describe("<Timestamp />", () => {
  it("doesn't render if timestamp is undefined", () => {
    render(<Timestamp timestamp={undefined} />);

    expect(screen.queryByTestId("timestamp")).not.toBeInTheDocument();
  });

  it("renders the relative timestamp", () => {
    render(<Timestamp timestamp="2021-09-24T15:00:00.000Z" />);

    expect(screen.getByTestId("timestamp")).toHaveTextContent("09/24/2021"); // TODO: add support for different locales
  });
});
