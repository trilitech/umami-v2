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
import {
  checkElementsRenderInCorrectOrder,
  getButtonByName,
  mockWindowLocation,
  queryButtonByName,
  restoreOriginalWindowLocation,
} from "@umami/test-utils";

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

const ADD_ACCOUNT = "Add account";
const ADDRESS_BOOK = "Address book";
const APPS = "Apps";
const LIGHT_MODE = "Light mode";
const SIGN_OUT = "Sign Out";
const PASSWORD = "Password";
const ERROR_LOGS = "Error logs";
const SAVE_BACKUP = "Save backup";
const NETWORK = "Network";
const LOCK_UMAMI = "Lock Umami";

const unverifiedUserMenuItems = [ADD_ACCOUNT, LIGHT_MODE, SIGN_OUT, PASSWORD, ERROR_LOGS];

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
    beforeAll(() => {
      mockWindowLocation();
    });
    afterAll(() => {
      restoreOriginalWindowLocation();
    });

    it("renders menu items in the correct order", async () => {
      const verifiedMenuItems = [
        ADD_ACCOUNT,
        ADDRESS_BOOK,
        PASSWORD,
        SAVE_BACKUP,
        APPS,
        NETWORK,
        ERROR_LOGS,
        LIGHT_MODE,
        LOCK_UMAMI,
        SIGN_OUT,
      ];

      await renderInDrawer(<Menu />, store);
      checkElementsRenderInCorrectOrder(
        verifiedMenuItems.map(btnName => () => getButtonByName(btnName))
      );
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

      await user.click(getButtonByName(SIGN_OUT));
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      const mockDownloadBackupFile = jest.fn();
      jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

      await renderInDrawer(<Menu />, store);

      await user.click(getButtonByName(SAVE_BACKUP));

      expect(mockDownloadBackupFile).toHaveBeenCalled();
    });

    it("calls toggleColorMode function when Light mode is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getButtonByName(LIGHT_MODE));

      expect(useColorMode().toggleColorMode).toHaveBeenCalled();
    });

    it("it clears the session and reload the window when 'Lock Umami' is clicked", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);
      await user.click(getButtonByName(LOCK_UMAMI));

      expect(window.sessionStorage.clear).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });

    it("opens Add Account modal when Add Account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getButtonByName(ADD_ACCOUNT));

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
      unverifiedUserMenuItems.forEach(btnName => expect(getButtonByName(btnName)).toBeVisible());

      expect(queryButtonByName(ADDRESS_BOOK)).not.toBeInTheDocument();
      expect(queryButtonByName(SAVE_BACKUP)).not.toBeInTheDocument();
      expect(queryButtonByName(APPS)).not.toBeInTheDocument();
      expect(queryButtonByName(NETWORK)).not.toBeInTheDocument();
      expect(queryButtonByName(LOCK_UMAMI)).not.toBeInTheDocument();
    });

    it("opens Add account modal when Add account button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      await renderInDrawer(<Menu />, store);

      await user.click(getButtonByName(ADD_ACCOUNT));

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

        expect(getButtonByName(ADDRESS_BOOK)).toBeVisible();
        expect(getButtonByName(ADD_ACCOUNT)).toBeVisible();
        expect(getButtonByName(SAVE_BACKUP)).toBeVisible();
        expect(getButtonByName(APPS)).toBeVisible();
        expect(getButtonByName(LIGHT_MODE)).toBeVisible();
        expect(getButtonByName(SIGN_OUT)).toBeVisible();
        expect(getButtonByName(PASSWORD)).toBeVisible();
        expect(getButtonByName(ERROR_LOGS)).toBeVisible();
        expect(getButtonByName(LOCK_UMAMI)).toBeVisible();

        if (isVerifiedSelected) {
          expect(getButtonByName(NETWORK)).toBeVisible();
        } else {
          expect(queryButtonByName(NETWORK)).not.toBeInTheDocument();
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

      it("opens LogoutModal modal when Sign Out button is clicked", async () => {
        const user = userEvent.setup();
        const { openWith } = dynamicModalContextMock;

        await renderInDrawer(<Menu />, store);

        await user.click(getButtonByName(SIGN_OUT));
        expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
      });

      it("calls downloadBackupFile function when Save Backup is clicked", async () => {
        const user = userEvent.setup();
        const mockDownloadBackupFile = jest.fn();
        jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

        await renderInDrawer(<Menu />, store);

        await user.click(getButtonByName(SAVE_BACKUP));

        expect(mockDownloadBackupFile).toHaveBeenCalled();
      });

      it("calls toggleColorMode function when Light mode is clicked", async () => {
        const user = userEvent.setup();
        await renderInDrawer(<Menu />, store);

        await user.click(getButtonByName(LIGHT_MODE));

        expect(useColorMode().toggleColorMode).toHaveBeenCalled();
      });

      it("opens Add Account modal when Add Account button is clicked", async () => {
        const { openWith } = dynamicModalContextMock;
        const user = userEvent.setup();
        await renderInDrawer(<Menu />, store);

        await user.click(getButtonByName(ADD_ACCOUNT));

        expect(openWith).toHaveBeenCalledWith(<OnboardOptionsModal />);
      });
    }
  );
});
