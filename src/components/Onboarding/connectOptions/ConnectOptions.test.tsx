import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import ConnectOptions from "./ConnectOptions";

const setStepMock = jest.fn((step: Step) => { });

const fixture = (setStep: (step: Step) => void) => (
  <ConnectOptions setStep={setStep} />
);

describe("<ConnectOptions />", () => {
  describe("Navigate to", () => {
    test("Import seed phrase", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /Import with Seed Phrase/i,
      });
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
      expect(setStepMock).toBeCalledWith({ type: StepType.restoreSeedphrase });
    });

    // test("Restore from Backup", async () => {
    //   render(fixture(setStepMock));
    //   const confirmBtn = screen.getByRole("button", { name: /Restore from Backup/i });
    //   fireEvent.click(confirmBtn);
    //   expect(setStepMock).toBeCalledTimes(1);
    //   expect(setStepMock).toBeCalledWith({ type: StepType.restoreBackup })
    // });

    test("Connect ledger", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /Connect ledger/i,
      });
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: undefined,
          pk: undefined,
          pkh: undefined,
        },
      });
    });
  });
});
