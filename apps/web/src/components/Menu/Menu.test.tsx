import { useColorMode } from "@chakra-ui/system";
import { mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  useDownloadBackupFile,
  walletKit,
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
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";

jest.mock("@chakra-ui/system", () => ({
  ...jest.requireActual("@chakra-ui/system"),
  useColorMode: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useDownloadBackupFile: jest.fn(),
  walletKit: {
    core: {},
    metadata: {
      name: "AppMenu test",
      description: "Umami Wallet with WalletConnect",
      url: "https://umamiwallet.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
    getActiveSessions: jest.fn(),
  },
  createWalletKit: jest.fn(),
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
      await renderInDrawer(<Menu />, store);

      expect(screen.getByText("Advanced")).toBeVisible();
      expect(screen.getByText("Address book")).toBeVisible();
      expect(screen.getByText("Add account")).toBeVisible();
      expect(screen.getByText("Save backup")).toBeVisible();
      expect(screen.getByText("Apps")).toBeVisible();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Log out")).toBeVisible();
    });

    it.each([
      ["Advanced", AdvancedMenu],
      ["Address book", AddressBookMenu],
      ["Apps", AppsMenu],
    ])("opens %label menu correctly", async (label, Component) => {
      const user = userEvent.setup();
      const { openWith } = dynamicDrawerContextMock;
      jest.spyOn(walletKit, "getActiveSessions").mockImplementation(() => ({}));

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText(label));
      expect(openWith).toHaveBeenCalledWith(<Component />);
    });

    it("opens Logout menu correctly", async () => {
      const user = userEvent.setup();
      const { openWith } = dynamicModalContextMock;

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Log out"));
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      const mockDownloadBackupFile = jest.fn();
      jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Save backup"));

      expect(mockDownloadBackupFile).toHaveBeenCalled();
    });

    it("calls toggleColorMode function when Light mode is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Light mode"));

      expect(useColorMode().toggleColorMode).toHaveBeenCalled();
    });

    it("opens Add Account modal when Add Account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Add account"));

      expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
    });
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
      expect(screen.queryByText("Address book")).not.toBeInTheDocument();
      expect(screen.queryByText("Add account")).toBeVisible();
      expect(screen.queryByText("Save backup")).not.toBeInTheDocument();
      expect(screen.queryByText("Apps")).not.toBeInTheDocument();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Log out")).toBeVisible();
    });

    it("opens Add account modal when Add account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Add account"));

      expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
    });
  });

  describe.each([
    { selectedAccount: "verified", isVerifiedSelected: true },
    { selectedAccount: "unverified", isVerifiedSelected: false },
  ])("when user has both and $selectedAccount account is selected", ({ isVerifiedSelected }) => {
    const unverifiedAccount = mockImplicitAccount(1);

    beforeEach(() => {
      addTestAccount(store, unverifiedAccount);
      store.dispatch(
        accountsActions.setIsVerified({
          pkh: unverifiedAccount.address.pkh,
          isVerified: false,
        })
      );
      if (isVerifiedSelected) {
        store.dispatch(accountsActions.setCurrent(account.address.pkh));
      } else {
        store.dispatch(accountsActions.setCurrent(unverifiedAccount.address.pkh));
      }
    });

    it("renders menu items correctly", async () => {
      await renderInDrawer(<Menu />, store);

      expect(screen.getByText("Advanced")).toBeVisible();
      expect(screen.getByText("Address book")).toBeVisible();
      expect(screen.getByText("Add account")).toBeVisible();
      expect(screen.getByText("Save backup")).toBeVisible();
      expect(screen.getByText("Apps")).toBeVisible();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Log out")).toBeVisible();
    });

    it.each([
      ["Advanced", AdvancedMenu],
      ["Address book", AddressBookMenu],
      ["Apps", AppsMenu],
    ])("opens %s menu correctly", async (label, Component) => {
      const user = userEvent.setup();
      const { openWith } = dynamicDrawerContextMock;
      jest.spyOn(walletKit, "getActiveSessions").mockImplementation(() => ({}));

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText(label));
      expect(openWith).toHaveBeenCalledWith(<Component />);
    });

    it("opens Log out menu correctly", async () => {
      const user = userEvent.setup();
      const { openWith } = dynamicModalContextMock;

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Log out"));
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      const mockDownloadBackupFile = jest.fn();
      jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Save backup"));

      expect(mockDownloadBackupFile).toHaveBeenCalled();
    });

    it("calls toggleColorMode function when Light mode is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Light mode"));

      expect(useColorMode().toggleColorMode).toHaveBeenCalled();
    });

    it("opens Add Account modal when Add Account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Add account"));

      expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
    });
  });
});
