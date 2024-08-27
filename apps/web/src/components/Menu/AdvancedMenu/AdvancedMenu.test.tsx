import { AdvancedMenu } from "./AdvancedMenu";
import { dynamicDrawerContextMock, renderInDrawer, screen, userEvent } from "../../../testUtils";
import { ChangePasswordMenu } from "../ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "../ErrorLogsMenu/ErrorLogsMenu";
import { NetworkMenu } from "../NetworkMenu/NetworkMenu";

describe("<AdvancedMenu />", () => {
  describe("when user is verified", () => {
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

  describe("when user is unverified", () => {
    beforeEach(() => {
      localStorage.setItem("user:verified", "false");
    });

    it("renders menu items correctly", async () => {
      await renderInDrawer(<AdvancedMenu />);

      expect(screen.getByText("Change Password")).toBeVisible();
      expect(screen.queryByText("Network")).not.toBeInTheDocument();
      expect(screen.getByText("Error Logs")).toBeVisible();
    });
  });
});
