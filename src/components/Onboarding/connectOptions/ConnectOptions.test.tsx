import { ConnectOptions } from "./ConnectOptions";
import { mockSocialAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { OnboardingStep } from "../OnboardingStep";

const goToStepMock = jest.fn();

const fixture = (goToStep: (step: OnboardingStep) => void) => (
  <ConnectOptions goToStep={goToStep} />
);

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
      expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreBackup" });
    });

    it("hides the button if a user tries to add another account", () => {
      addAccount(mockSocialAccount(0));

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
    expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreMnemonic" });
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
    expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreSecretKey" });
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
      type: "nameAccount",
      account: { type: "ledger" },
    });
  });
});
