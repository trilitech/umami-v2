import { NameAccountStep, Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NameAccount from "./NameAccount";
import { ReduxStore } from "../../../providers/ReduxStore";
import { mnemonic1 } from "../../../mocks/mockMnemonic";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void, account: NameAccountStep["account"]) => (
  <ReduxStore>
    <NameAccount goToStep={goToStep} account={account} />
  </ReduxStore>
);

describe("<NameAccount />", () => {
  const accounts = [
    { type: "ledger" as const },
    { type: "mnemonic" as const, seedphrase: mnemonic1 },
  ];
  accounts.forEach(async account => {
    test(`Set a name for ${account.type}`, async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const name = screen.getByTestId("name");
      fireEvent.change(name, { target: { value: "name" } });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        account: { ...account, label: "name" },
      });
    });

    test(`Set no name for ${account.type}`, async () => {
      render(fixture(goToStepMock, account));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        account: { ...account, label: "Account 1" },
      });
    });
  });
});
