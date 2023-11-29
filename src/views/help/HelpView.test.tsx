import { HelpView } from "./HelpView";
import { render, screen } from "../../mocks/testUtils";

describe("<HelpView />", () => {
  test("renders cards", () => {
    render(<HelpView />);

    const results = screen.getAllByTestId("help-card");
    expect(results).toHaveLength(3);
  });
});
