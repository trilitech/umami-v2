import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { ConnectOptions } from "./ConnectOptions";

const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void) => <ConnectOptions goToStep={goToStep} />;

describe("<ConnectOptions />", () => {
  describe("Navigate to", () => {
    test("Import seed phrase", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /Import with Seed Phrase/i,
      });
      fireEvent.click(confirmBtn);
      expect(goToStepMock).toBeCalledTimes(1);
      expect(goToStepMock).toBeCalledWith({ type: StepType.restoreMnemonic });
    });

    test("Connect ledger", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /Connect ledger/i,
      });
      fireEvent.click(confirmBtn);
      expect(goToStepMock).toBeCalledTimes(1);
      expect(goToStepMock).toBeCalledWith({
        type: StepType.nameAccount,
        account: { type: "ledger" },
      });
    });
  });
});
