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
      account: { type: "mnemonic" as const, label: "mnemonic account", seedphrase: mnemonic1 },
      nextPage: StepType.masterPassword,
      derivationPath: "44'/1729'/?'/0'",
    },
  ];

  testData.forEach(async ({ account, nextPage, derivationPath }) => {
    describe(`For ${account.type}`, () => {
      describe("When default path is selected", () => {
        test("Return default path", async () => {
          render(fixture(goToStepMock, account));
          const confirmBtn = screen.getByRole("button", { name: /continue/i });
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

        test("Return default path even if textfield has been modified", async () => {
          render(fixture(goToStepMock, account));
          const confirmBtn = screen.getByRole("button", { name: /continue/i });
          const customPath = screen.getByTestId("custom-path");
          fireEvent.change(customPath, { target: { value: "test" } });

          await waitFor(() => {
            expect(confirmBtn).toBeEnabled();
          });
          fireEvent.click(confirmBtn);
          await waitFor(() => {
            expect(goToStepMock).toBeCalledTimes(1);
          });
          expect(goToStepMock).toBeCalledWith({
            type: nextPage,
            account: { ...account, derivationPath },
          });
        });
      });

      test("When valid custom path is selected we use it instead", async () => {
        render(fixture(goToStepMock, account));
        const confirmBtn = screen.getByRole("button", { name: /continue/i });
        const customPath = screen.getByTestId("custom-path");
        expect(customPath).toBeDisabled();
        const switchBtn = screen.getByTestId("switch");
        fireEvent.click(switchBtn);
        expect(customPath).toBeEnabled();

        const standard5PieceDerivationPath = "44'/1729'/?'/0'/0'";

        fireEvent.change(customPath, { target: { value: standard5PieceDerivationPath } });
        expect(customPath).toHaveValue(standard5PieceDerivationPath);
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
    });
  });
});
