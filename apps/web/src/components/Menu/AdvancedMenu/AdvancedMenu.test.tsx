import { mockImplicitAccount } from "@umami/core";
import { type UmamiStore, accountsActions, addTestAccount, makeStore } from "@umami/state";

import { AdvancedMenu } from "./AdvancedMenu";
import { dynamicDrawerContextMock, renderInDrawer, screen, userEvent } from "../../../testUtils";
import { ChangePasswordMenu } from "../ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "../ErrorLogsMenu/ErrorLogsMenu";
import { NetworkMenu } from "../NetworkMenu/NetworkMenu";

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<AdvancedMenu />", () => {
  describe("when user is verified", () => {
    it("renders advanced menu items correctly", async () => {
      await renderInDrawer(<AdvancedMenu />, store);

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

      await renderInDrawer(<AdvancedMenu />, store);

      await userEvent.click(screen.getByText(label));
      expect(openWith).toHaveBeenCalledWith(<Component />);
    });
  });

  describe("when user is unverified", () => {
    it("renders menu items correctly", async () => {
      store.dispatch(
        accountsActions.setIsVerified({
          pkh: account.address.pkh,
          isVerified: false,
        })
      );

      await renderInDrawer(<AdvancedMenu />, store);

      expect(screen.getByText("Change Password")).toBeVisible();
      expect(screen.queryByText("Network")).not.toBeInTheDocument();
      expect(screen.getByText("Error Logs")).toBeVisible();
    });
  });
});
