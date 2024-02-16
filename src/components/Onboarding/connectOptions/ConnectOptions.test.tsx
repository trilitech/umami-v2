import { ConnectOptions } from "./ConnectOptions";
import { mockSocialAccount } from "../../../mocks/factories";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { accountsActions } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { Step, StepType } from "../useOnboardingModal";

const goToStepMock = jest.fn();

const fixture = (goToStep: (step: Step) => void) => <ConnectOptions goToStep={goToStep} />;

describe("<ConnectOptions />", () => {
  describe("restore from backup", () => {
    it("navigates to the restore backup step", async () => {
      const user = userEvent.setup();
      render(fixture(goToStepMock));

      await act(() =>
        user.click(
          screen.getByRole("button", {
            name: "Restore from Backup",
          })
        )
      );

      expect(goToStepMock).toHaveBeenCalledTimes(1);
      expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.restoreBackup });
    });

    it("hides the button if a user tries to add another account", () => {
      store.dispatch(accountsActions.addAccount(mockSocialAccount(0)));

      render(fixture(goToStepMock));

      expect(screen.queryByRole("button", { name: "Restore from Backup" })).not.toBeInTheDocument();
    });
  });

  it("navigates to import seed phrase step", async () => {
    const user = userEvent.setup();
    render(fixture(goToStepMock));

    await user.click(
      screen.getByRole("button", {
        name: "Import with Seed Phrase",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.restoreMnemonic });
  });

  it("navigates to import secret key step", async () => {
    const user = userEvent.setup();
    render(fixture(goToStepMock));

    await user.click(
      screen.getByRole("button", {
        name: "Import with Secret Key",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({ type: StepType.restoreSecretKey });
  });

  it("navigates to connect ledger step", async () => {
    const user = userEvent.setup();
    render(fixture(goToStepMock));

    await user.click(
      screen.getByRole("button", {
        name: "Connect ledger",
      })
    );

    expect(goToStepMock).toHaveBeenCalledTimes(1);
    expect(goToStepMock).toHaveBeenCalledWith({
      type: StepType.nameAccount,
      account: { type: "ledger" },
    });
  });
});
