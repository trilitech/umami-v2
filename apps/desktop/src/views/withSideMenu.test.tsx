import { withSideMenu } from "./withSideMenu";
import { render, screen } from "../mocks/testUtils";

describe("withSideMenu", () => {
  it("renders the side menu", () => {
    render(withSideMenu(<></>));

    expect(screen.getByTestId(/^side-navbar/)).toBeVisible();
  });

  it("renders children", () => {
    render(withSideMenu(<div>some text</div>));

    expect(screen.getByText("some text")).toBeVisible();
  });
});
