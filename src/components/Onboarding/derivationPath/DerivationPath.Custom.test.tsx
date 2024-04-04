import { DerivationPath } from "./DerivationPath";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";

jest.unmock("../../../utils/tezos");

const goToStepMock = jest.fn();

const mnemonicAccount = { type: "mnemonic" as const, label: "account label", mnemonic: mnemonic1 };
const ledgerAccount = { type: "ledger" as const, label: "account label" };

describe("<DerivationPath />", () => {
  describe("With custom path", () => {
    it("validates custom path", async () => {
      render(<DerivationPath account={mnemonicAccount} goToStep={goToStepMock} />);

      fireEvent.click(screen.getByTestId("custom-path-switch"));

      const customPathInput = screen.getByTestId("custom-path-input");
      fireEvent.change(customPathInput, { target: { value: "random text" } });
      fireEvent.blur(customPathInput);

      await waitFor(() => expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled());
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Derivation path must start with `44'/1729'/`"
      );
    });

    it("converts mnemonic to a secret key account when custom path is selected", async () => {
      render(<DerivationPath account={mnemonicAccount} goToStep={goToStepMock} />);

      fireEvent.click(screen.getByTestId("custom-path-switch"));

      const customPathInput = screen.getByTestId("custom-path-input");
      fireEvent.change(customPathInput, { target: { value: "44'/1729'/0'/0'" } });
      fireEvent.blur(customPathInput);

      const confirmBtn = screen.getByRole("button", { name: "Continue" });

      await waitFor(() => expect(confirmBtn).toBeEnabled());

      fireEvent.click(confirmBtn);

      await waitFor(() =>
        expect(goToStepMock).toHaveBeenCalledWith({
          type: "masterPassword",
          account: {
            type: "secret_key",
            label: "account label",
            secretKey:
              "edskRicpWcBughiZrP7jDEXse7gMSwa1HG6CEEHZa9y6eBYfpoAii3BqFdemgfpehhbGjxgkPpECxqcCQReGNLsAsh46TwGDEA",
          },
        })
      );
    });

    it("sets a hardcoded derivation path for a ledger account", async () => {
      const derivationPath = "44'/1729'/0'/0'";
      render(<DerivationPath account={ledgerAccount} goToStep={goToStepMock} />);

      fireEvent.click(screen.getByTestId("custom-path-switch"));

      const customPathInput = screen.getByTestId("custom-path-input");
      fireEvent.change(customPathInput, { target: { value: derivationPath } });
      fireEvent.blur(customPathInput);

      const confirmBtn = screen.getByRole("button", { name: "Continue" });

      await waitFor(() => expect(confirmBtn).toBeEnabled());

      fireEvent.click(confirmBtn);

      await waitFor(() =>
        expect(goToStepMock).toHaveBeenCalledWith({
          type: "restoreLedger",
          account: {
            type: "ledger",
            label: "account label",
            derivationPath,
          },
        })
      );
    });
  });
});
