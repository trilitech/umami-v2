import { render, screen } from "./mocks/testUtils";
import { WelcomeScreen } from "./WelcomeScreen";

const fixture = () => <WelcomeScreen />;

describe("<WelcomeScreen />", () => {
  it("displays slider items", () => {
    render(fixture());
    // The slider library renders the first and the last slides twice
    expect(screen.getAllByTestId("slide-1")).toHaveLength(2);
    expect(screen.getByTestId("slide-2")).toBeInTheDocument();
    expect(screen.getAllByTestId("slide-3")).toHaveLength(2);
  });
});
