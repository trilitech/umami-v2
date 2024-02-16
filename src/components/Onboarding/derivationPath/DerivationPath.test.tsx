import { noop } from "lodash";

import { DerivationPath } from "./DerivationPath";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { DerivationPathStep, StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn(noop);

const fixture = (account: DerivationPathStep["account"]) => (
  <DerivationPath account={account} goToStep={goToStepMock} />
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

  describe.each(testData)("For $account.type", ({ account, nextPage, derivationPath }) => {
    it("uses default path", async () => {
      const user = userEvent.setup();
      render(fixture(account));

      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      expect(confirmBtn).toBeEnabled();

      await act(() => user.click(confirmBtn));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPath,
        },
      });
    });

    it("allows to select a custom path", async () => {
      const user = userEvent.setup();
      const standard5PieceDerivationPath = "44'/1729'/?'/0'/0'";

      render(fixture(account));

      const confirmBtn = screen.getByRole("button", { name: /continue/i });

      await act(() => user.click(screen.getByTestId("select-input")));

      expect(screen.getByTestId("select-options")).toBeInTheDocument();

      await act(() => user.click(screen.getByText(`m/${standard5PieceDerivationPath}`)));
      expect(screen.getByTestId("select-input")).toHaveTextContent(standard5PieceDerivationPath);
      expect(confirmBtn).toBeEnabled();

      await act(() => user.click(confirmBtn));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: nextPage,
        account: {
          ...account,
          derivationPath: standard5PieceDerivationPath,
        },
      });
    });
  });
});
