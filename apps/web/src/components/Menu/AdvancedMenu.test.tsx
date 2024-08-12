import { AdvancedMenu } from "./AdvancedMenu";
import { ChangePasswordMenu } from "./ChangePasswordMenu";
import { ErrorLogsMenu } from "./ErrorLogsMenu";
import { NetworkMenu } from "./NetworkMenu";
import { dynamicDrawerContextMock, renderInDrawer, screen, userEvent } from "../../testUtils";

describe("<AdvancedMenu />", () => {
  it("renders advanced menu items correctly", async () => {
    await renderInDrawer(<AdvancedMenu />);

    expect(screen.getByText("Change Password")).toBeVisible();
    expect(screen.getByText("Network")).toBeVisible();
    expect(screen.getByText("Error Logs")).toBeVisible();
  });

  it.each([
    ["Change Password", ChangePasswordMenu],
    ["Network", NetworkMenu],
    ["Error Logs", ErrorLogsMenu],
  ])("opens %label menu", async (label, Component) => {
    const { openWith } = dynamicDrawerContextMock;

    await renderInDrawer(<AdvancedMenu />);

    await userEvent.click(screen.getByText(label));
    expect(openWith).toHaveBeenCalledWith(<Component />);
  });
});
