import {
  type UmamiStore,
  makeStore,
  useRestoreFromMnemonic,
  useRestoreFromSecretKey,
} from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { SetupPassword } from "./SetupPassword";
import { act, fireEvent, renderInModal, screen, userEvent, waitFor } from "../../../testUtils";
import { CURVES } from "../AdvancedAccountSettings";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useRestoreFromMnemonic: jest.fn(),
  useRestoreFromSecretKey: jest.fn(),
}));

const password = "password";

describe("<SetupPassword />", () => {
  describe.each(["mnemonic", "secret_key"] as const)("%s mode", mode => {
    describe("validations", () => {
      it("requires a password", async () => {
        await renderInModal(<SetupPassword mode={mode} />);

        const passwordInput = screen.getByLabelText("Set Password");
        fireEvent.click(passwordInput);
        fireEvent.blur(passwordInput);

        await waitFor(() => expect(screen.getByText("Password is required")).toBeVisible());
      });

      it("requires a password confirmation", async () => {
        await renderInModal(<SetupPassword mode={mode} />);

        const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

        fireEvent.click(passwordConfirmationInput);
        fireEvent.blur(passwordConfirmationInput);

        await waitFor(() =>
          expect(screen.getByText("Password confirmation is required")).toBeVisible()
        );
      });

      it("requires the password and confirmation to match", async () => {
        await renderInModal(<SetupPassword mode={mode} />);

        const passwordInput = screen.getByLabelText("Set Password");
        const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

        fireEvent.input(passwordInput, { target: { value: password } });
        fireEvent.blur(passwordInput);
        fireEvent.input(passwordConfirmationInput, { target: { value: "password_" } });

        fireEvent.blur(passwordConfirmationInput);

        await waitFor(() => expect(screen.getByText("Passwords do not match")).toBeVisible());

        fireEvent.input(passwordConfirmationInput, { target: { value: password } });
        fireEvent.blur(passwordConfirmationInput);

        await waitFor(() =>
          expect(screen.queryByText("Passwords do not match")).not.toBeInTheDocument()
        );
      });
    });
  });

  describe("secret_key mode", () => {
    it("doesn't render advanced section", async () => {
      await renderInModal(<SetupPassword mode="secret_key" />);

      expect(screen.queryByTestId("advanced-section")).not.toBeInTheDocument();
    });

    it("calls restoreFromSecretKey with default parameters", async () => {
      const user = userEvent.setup();
      const store = makeStore();
      const allFormValues = {
        secretKey:
          "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
        secretKeyPassword: "",
      };
      const mockRestoreFromSecretKey = jest.fn();
      jest.mocked(useRestoreFromSecretKey).mockReturnValue(mockRestoreFromSecretKey);

      await renderInModal(<SetupPassword mode="secret_key" />, store, allFormValues);

      const passwordInput = screen.getByLabelText("Set Password");
      const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

      await act(() => user.type(passwordInput, password));
      await act(() => user.type(passwordConfirmationInput, password));

      const submitButton = screen.getByRole("button", { name: "Import Wallet" });

      await act(() => user.click(submitButton));

      await waitFor(() => expect(mockRestoreFromSecretKey).toHaveBeenCalledTimes(1));
      expect(mockRestoreFromSecretKey).toHaveBeenCalledWith(
        allFormValues.secretKey,
        password,
        "Account"
      );
    });
  });

  describe("mnemonic mode", () => {
    let store: UmamiStore;
    const allFormValues = { mnemonic: mnemonic1.split(" ").map(word => ({ val: word })) };
    const mockRestoreFromMnemonic = jest.fn();

    beforeEach(() => {
      store = makeStore();
      jest.mocked(useRestoreFromMnemonic).mockReturnValue(mockRestoreFromMnemonic);
    });

    it("renders advanced section", async () => {
      await renderInModal(<SetupPassword mode="mnemonic" />, store, allFormValues);

      expect(screen.getByTestId("advanced-section")).toBeVisible();
    });

    it("calls restoreFromMnemonic with default parameters", async () => {
      const user = userEvent.setup();
      await renderInModal(<SetupPassword mode="mnemonic" />, store, allFormValues);

      const passwordInput = screen.getByLabelText("Set Password");
      const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

      await act(() => user.type(passwordInput, password));
      await act(() => user.type(passwordConfirmationInput, password));

      const submitButton = screen.getByRole("button", { name: "Import Wallet" });
      await act(() => user.click(submitButton));

      await waitFor(() => expect(mockRestoreFromMnemonic).toHaveBeenCalledTimes(1));
      expect(mockRestoreFromMnemonic).toHaveBeenCalledWith({
        mnemonic: mnemonic1,
        password: password,
        derivationPathTemplate: "44'/1729'/?'/0'",
        label: "Account",
        curve: "ed25519",
      });
    });

    it.each(CURVES)("calls restoreFromMnemonic with curve %s", async curve => {
      const user = userEvent.setup();
      await renderInModal(<SetupPassword mode="mnemonic" />, store, allFormValues);

      const passwordInput = screen.getByLabelText("Set Password");
      const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

      await act(() => user.type(passwordInput, password));
      await act(() => user.type(passwordConfirmationInput, password));

      await act(() => user.click(screen.getByRole("button", { name: "Advanced" })));

      const curveButton = await screen.findByRole("button", { name: curve });
      await act(() => user.click(curveButton));

      const submitButton = screen.getByRole("button", { name: "Import Wallet" });
      await act(() => user.click(submitButton));

      await waitFor(() => expect(mockRestoreFromMnemonic).toHaveBeenCalledTimes(1));
      expect(mockRestoreFromMnemonic).toHaveBeenCalledWith({
        mnemonic: mnemonic1,
        password: password,
        derivationPathTemplate: "44'/1729'/?'/0'",
        label: "Account",
        curve,
      });
    });

    it("allows to amend the default derivation path", async () => {
      const user = userEvent.setup();
      await renderInModal(<SetupPassword mode="mnemonic" />, store, allFormValues);

      const passwordInput = screen.getByLabelText("Set Password");
      const passwordConfirmationInput = screen.getByLabelText("Confirm Password");

      await act(() => user.type(passwordInput, password));
      await act(() => user.type(passwordConfirmationInput, password));

      await act(() => user.click(screen.getByRole("button", { name: "Advanced" })));

      const derivationPathInput = screen.getByLabelText("Derivation Path");
      await act(() => user.clear(derivationPathInput));
      await act(() => user.type(derivationPathInput, "m/44'/1729'/0'/0'/0'"));

      const submitButton = screen.getByRole("button", { name: "Import Wallet" });
      await act(() => user.click(submitButton));

      await waitFor(() => expect(mockRestoreFromMnemonic).toHaveBeenCalledTimes(1));
      expect(mockRestoreFromMnemonic).toHaveBeenCalledWith({
        mnemonic: mnemonic1,
        password: password,
        derivationPathTemplate: "m/44'/1729'/0'/0'/0'",
        label: "Account",
        curve: "ed25519",
      });
    });
  });
});
