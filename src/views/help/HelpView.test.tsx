import { render, screen } from "../../mocks/testUtils";
import HelpView from "./HelpView";

describe("<HelpView />", () => {
  test("renders cards", () => {
    render(<HelpView />);

    const results = screen.getAllByTestId("help-card");
    expect(results).toHaveLength(4);
  });
});
