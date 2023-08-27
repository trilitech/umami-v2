import { DerivationPathStep, Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DerivationPath from "./DerivationPath";
import { mnemonic1 } from "../../../mocks/mockMnemonic";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: DerivationPathStep["account"]) => (
  <DerivationPath goToStep={goToStep} account={account} />
);

describe("<DerivationPath />", () => {
  const testData = [
    {
      account: { type: "ledger" as const, label: "ledger account" },
      nextPage: StepType.restoreLedger,
      derivationPath: "44'/1729'/?'/0'",
    },
    {
      account: { type: "mnemonic" as const, label: "mnemonic account", mnemonic: mnemonic1 },
      nextPage: StepType.masterPassword,
      derivationPath: "44'/1729'/?'/0'",
    },
  ];

  testData.forEach(async ({ account, nextPage, derivationPath }) => {
    describe(`For ${account.type}`, () => {
      it("uses default path", async () => {
        render(fixture(goToStepMock, account));
        const confirmBtn = screen.getByRole("button", { name: /continue/i });
        await waitFor(() => {
          expect(confirmBtn).toBeEnabled();
        });
        fireEvent.click(confirmBtn);
        await waitFor(() => {
          expect(goToStepMock).toBeCalledTimes(1);
        });
        expect(goToStepMock).toBeCalledWith({
          type: nextPage,
          account: {
            ...account,
            derivationPath,
          },
        });
      });

      it("allows to specify a custom path", async () => {
        render(fixture(goToStepMock, account));
        const confirmBtn = screen.getByRole("button", { name: /continue/i });
        const customPathInput = screen.getByTestId("custom-path");
        expect(customPathInput).toBeDisabled();
        const switchBtn = screen.getByTestId("switch");
        fireEvent.click(switchBtn);
        expect(customPathInput).toBeEnabled();

        const standard5PieceDerivationPath = "44'/1729'/?'/0'/0'";

        fireEvent.change(customPathInput, { target: { value: standard5PieceDerivationPath } });
        expect(customPathInput).toHaveValue(standard5PieceDerivationPath);
        await waitFor(() => {
          expect(confirmBtn).toBeEnabled();
        });
        fireEvent.click(confirmBtn);
        await waitFor(() => {
          expect(goToStepMock).toBeCalledTimes(1);
        });
        expect(goToStepMock).toBeCalledWith({
          type: nextPage,
          account: {
            ...account,
            derivationPath: standard5PieceDerivationPath,
          },
        });
      });

      it("displays an error if the derivation path is invalid", async () => {
        render(fixture(goToStepMock, account));
        const confirmBtn = screen.getByRole("button", { name: /continue/i });
        const customPathInput = screen.getByTestId("custom-path");
        expect(customPathInput).toBeDisabled();
        fireEvent.click(screen.getByTestId("switch"));
        expect(customPathInput).toBeEnabled();

        await waitFor(() => {
          expect(confirmBtn).toBeEnabled();
        });

        fireEvent.change(customPathInput, { target: { value: "bad data" } });
        fireEvent.blur(customPathInput);
        await waitFor(() => {
          expect(customPathInput).toHaveValue("bad data");
        });
        expect(screen.getByTestId("error-message")).toHaveTextContent(
          "Please enter a valid derivation path"
        );
      });
    });
  });
});
