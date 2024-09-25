import { useColorMode } from "@chakra-ui/system";
import { mockImplicitAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  useDownloadBackupFile,
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
}));

let store: UmamiStore;
const account = mockImplicitAccount(0);
const password = "Qwerty123123!23vcxz";

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

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText(label));
      expect(openWith).toHaveBeenCalledWith(<Component />);
    });

    it("opens Logout menu correctly", async () => {
      const user = userEvent.setup();
      const { openWith } = dynamicModalContextMock;

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Logout"));
      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("calls downloadBackupFile function when Save Backup is clicked", async () => {
      const user = userEvent.setup();
      const mockDownloadBackupFile = jest.fn();
      jest.mocked(useDownloadBackupFile).mockReturnValue(mockDownloadBackupFile);

      await renderInDrawer(<Menu />, store);

      await user.click(screen.getByText("Save Backup"));

      await user.type(screen.getByLabelText("Set Password"), password);
      await user.type(screen.getByLabelText("Confirm Password"), password);
      await user.click(screen.getByRole("button", { name: "Save Backup" }));

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

      await user.click(screen.getByText("Add Account"));

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
      expect(screen.queryByText("Address Book")).not.toBeInTheDocument();
      expect(screen.queryByText("Add Account")).not.toBeInTheDocument();
      expect(screen.queryByText("Save Backup")).not.toBeInTheDocument();
      expect(screen.queryByText("Apps")).not.toBeInTheDocument();
      expect(screen.getByText("Light mode")).toBeVisible();
      expect(screen.getByText("Logout")).toBeVisible();
    });
  });
});
