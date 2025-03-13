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
import { ChangePasswordMenu } from "./ChangePasswordMenu/ChangePasswordMenu";
import { ErrorLogsMenu } from "./ErrorLogsMenu/ErrorLogsMenu";
import { NetworkMenu } from "./NetworkMenu/NetworkMenu";

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

const getAddAccountButton = () => screen.getByRole("button", { name: "Add account" });
const queryAddAccountButton = () => screen.queryByRole("button", { name: "Add account" });
const getAddressBookButton = () => screen.getByRole("button", { name: "Address book" });
const queryAddressBookButton = () => screen.queryByRole("button", { name: "Address book" });
const getSaveBackupButton = () => screen.getByRole("button", { name: "Save backup" });
const querySaveBackupBtn = () => screen.queryByRole("button", { name: "Save backup" });
const getAppsButton = () => screen.getByRole("button", { name: "Apps" });
const queryAppsButton = () => screen.queryByRole("button", { name: "Apps" });
const getErrorLogsButton = () => screen.getByRole("button", { name: "Error logs" });
const getNetworkButton = () => screen.getByRole("button", { name: "Network" });
const queryNetworkButton = () => screen.queryByRole("button", { name: "Network" });
const getLightModeButton = () => screen.getByRole("button", { name: "Light mode" });
const getPasswordButton = () => screen.getByRole("button", { name: "Password" });
const getSignOutButton = () => screen.getByRole("button", { name: "Sign Out" });
const getLockUmamiButton = () => screen.getByRole("button", { name: "Lock Umami" });
const queryLockUmamiButton = () => screen.queryByRole("button", { name: "Lock Umami" });

const verifiedMenuItems = [
  getAddAccountButton,
  getAddressBookButton,
  getPasswordButton,
  getSaveBackupButton,
  getAppsButton,
  getNetworkButton,
  getErrorLogsButton,
  getLightModeButton,
  getLockUmamiButton,
  getSignOutButton,
];

const unverifiedUserMenuItems = [
  queryAddAccountButton,
  getLightModeButton,
  getSignOutButton,
  getPasswordButton,
  getErrorLogsButton,
];

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
    it("renders menu items in the correct order", async () => {
      await renderInDrawer(<Menu />, store);

      for (let i = 1; i < verifiedMenuItems.length; i++) {
        const currentMenuItem = verifiedMenuItems[i]();
        const previousMenuItem = verifiedMenuItems[i - 1]();
        try {
          expect(previousMenuItem.compareDocumentPosition(currentMenuItem)).toBe(
            Node.DOCUMENT_POSITION_FOLLOWING
          );
        } catch {
          throw new Error(
            `"${previousMenuItem.textContent}" should appear before "${currentMenuItem.textContent}"`
          );
        }
      }
    });

    it.each([
      ["Address book", AddressBookMenu],
      ["Apps", AppsMenu],
      ["Password", ChangePasswordMenu],
      ["Network", NetworkMenu],
      ["Error logs", ErrorLogsMenu],
    ])("opens %s menu correctly", async (label, Component) => {
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

      await user.click(getSignOutButton());
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      const mockDownloadBackupFile = jest.fn();
      jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

      await renderInDrawer(<Menu />, store);

      await user.click(getSaveBackupButton());

      expect(mockDownloadBackupFile).toHaveBeenCalled();
    });

    it("calls toggleColorMode function when Light mode is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getLightModeButton());

      expect(useColorMode().toggleColorMode).toHaveBeenCalled();
    });

    it("it clears the session and reload the window when 'Lock Umami' is clicked", async () => {
      const sessionStorageClearMock = jest.fn();
      Object.defineProperty(window, "sessionStorage", {
        value: {
          ...window.sessionStorage,
          clear: sessionStorageClearMock,
        },
      });
      delete (window as any).location;
      const reloadWindowMock = jest.fn();
      window.location = { reload: reloadWindowMock } as any;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getLockUmamiButton());

      expect(sessionStorageClearMock).toHaveBeenCalled();
      expect(reloadWindowMock).toHaveBeenCalled();
    });

    it("opens Add Account modal when Add Account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getAddAccountButton());

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
      unverifiedUserMenuItems.forEach(getItem => getItem());

      expect(queryAddressBookButton()).not.toBeInTheDocument();
      expect(querySaveBackupBtn()).not.toBeInTheDocument();
      expect(queryAppsButton()).not.toBeInTheDocument();
      expect(queryNetworkButton()).not.toBeInTheDocument();
      expect(queryLockUmamiButton()).not.toBeInTheDocument();
    });

    it("opens Add account modal when Add account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getAddAccountButton());

      expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
    });
  });

  describe.each([
    { selectedAccount: "verified", isVerifiedSelected: true },
    { selectedAccount: "unverified", isVerifiedSelected: false },
  ])(
    "when the user has multiple accounts (one verified and one unverified), and the $selectedAccount account is selected",
    ({ isVerifiedSelected }) => {
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

        getAddressBookButton();
        getAddAccountButton();
        getSaveBackupButton();
        getAppsButton();
        getLightModeButton();
        getSignOutButton();
        getPasswordButton();
        getErrorLogsButton();
        getLockUmamiButton();
        if (isVerifiedSelected) {
          getNetworkButton();
        } else {
          expect(queryNetworkButton()).not.toBeInTheDocument();
        }
      });

      it.each([
        ["Address book", AddressBookMenu],
        ["Apps", AppsMenu],
        ["Password", ChangePasswordMenu],
        ["Error logs", ErrorLogsMenu],
      ])("opens %s menu correctly", async (label, Component) => {
        const user = userEvent.setup();
        const { openWith } = dynamicDrawerContextMock;
        jest.spyOn(walletKit, "getActiveSessions").mockImplementation(() => ({}));

        await renderInDrawer(<Menu />, store);

        await user.click(screen.getByText(label));
        expect(openWith).toHaveBeenCalledWith(<Component />);
      });

      it("opens Sign Out menu correctly", async () => {
        const user = userEvent.setup();
        const { openWith } = dynamicModalContextMock;

        await renderInDrawer(<Menu />, store);

        await user.click(getSignOutButton());
        expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
      });

      it("calls downloadBackupFile function when Save Backup is clicked", async () => {
        const user = userEvent.setup();
        const mockDownloadBackupFile = jest.fn();
        jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

        await renderInDrawer(<Menu />, store);

        await user.click(getSaveBackupButton());

        expect(mockDownloadBackupFile).toHaveBeenCalled();
      });

      it("calls toggleColorMode function when Light mode is clicked", async () => {
        const user = userEvent.setup();
        await renderInDrawer(<Menu />, store);

        await user.click(getLightModeButton());

        expect(useColorMode().toggleColorMode).toHaveBeenCalled();
      });

      it("opens Add Account modal when Add Account button is clicked", async () => {
        const { openWith } = dynamicModalContextMock;
        const user = userEvent.setup();
        await renderInDrawer(<Menu />, store);

        await user.click(getAddAccountButton());

        expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
      });
    }
  );
});
