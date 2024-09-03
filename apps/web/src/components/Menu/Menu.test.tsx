import { useColorMode } from "@chakra-ui/system";
import { mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  downloadBackupFile,
  makeStore,
} from "@umami/state";

import { AddressBookMenu } from "./AddressBookMenu/AddressBookMenu";
import { AdvancedMenu } from "./AdvancedMenu/AdvancedMenu";
import { AppsMenu } from "./AppsMenu/AppsMenu";
import { LogoutModal } from "./LogoutModal";
import { Menu } from "./Menu";
import {
  dynamicDrawerContextMock,
  dynamicModalContextMock,
  renderInDrawer,
  screen,
  userEvent,
} from "../../testUtils";

jest.mock("@chakra-ui/system", () => ({
  ...jest.requireActual("@chakra-ui/system"),
  useColorMode: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  downloadBackupFile: jest.fn(),
}));

let store: UmamiStore;
const account = mockImplicitAccount(0);

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<Menu />", () => {
  beforeEach(() => {
    jest.mocked(useColorMode).mockReturnValue({
      colorMode: "light",
      toggleColorMode: jest.fn(),
      setColorMode: jest.fn(),
    });
  });

  describe("when user is verified", () => {
    it("renders menu items correctly", async () => {
      await renderInDrawer(<Menu />);

      expect(screen.getByText("Advanced")).toBeVisible();
      expect(screen.getByText("Address Book")).toBeVisible();
      expect(screen.getByText("Add Account")).toBeVisible();
      expect(screen.getByText("Save Backup")).toBeVisible();
      expect(screen.getByText("Apps")).toBeVisible();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Logout")).toBeVisible();
    });

    it.each([
      ["Advanced", AdvancedMenu],
      ["Address Book", AddressBookMenu],
      ["Apps", AppsMenu],
    ])("opens %label menu correctly", async (label, Component) => {
      const user = userEvent.setup();
      const { openWith } = dynamicDrawerContextMock;

      await renderInDrawer(<Menu />);

      await user.click(screen.getByText(label));
      expect(openWith).toHaveBeenCalledWith(<Component />);
    });

    it("opens Logout menu correctly", async () => {
      const user = userEvent.setup();
      const { openWith } = dynamicModalContextMock;

      await renderInDrawer(<Menu />);

      await user.click(screen.getByText("Logout"));
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />);

      await user.click(screen.getByText("Save Backup"));

      expect(downloadBackupFile).toHaveBeenCalled();
    });

    it("calls toggleColorMode function when Light mode is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />);

      await user.click(screen.getByText("Light mode"));

      expect(useColorMode().toggleColorMode).toHaveBeenCalled();
    });

    // TODO: add when Add Account logic is ready
    // it("opens Add Account modal when Add Account button is clicked", async () => {
    //   const user = userEvent.setup();
    //   await renderInDrawer(<Menu />);

    //   await user.click(screen.getByText("Add Account"));

    //   expect(useOnboardingModal().onOpen).toHaveBeenCalled();
    // });
  });

  describe("when user is unverified", () => {
    beforeEach(() => {
      store.dispatch(
        accountsActions.setIsVerified({
          pkh: account.address.pkh,
          isVerified: false,
        })
      );
    });

    it("renders menu items correctly", async () => {
      await renderInDrawer(<Menu />, store);

      expect(screen.getByText("Advanced")).toBeVisible();
      expect(screen.queryByText("Address Book")).not.toBeInTheDocument();
      expect(screen.queryByText("Add Account")).not.toBeInTheDocument();
      expect(screen.queryByText("Save Backup")).not.toBeInTheDocument();
      expect(screen.queryByText("Apps")).not.toBeInTheDocument();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Logout")).toBeVisible();
    });
  });
});
