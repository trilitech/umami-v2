import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import ConnectOrCreate from "./ConnectOrCreate";
import { ReduxStore } from "../../../providers/ReduxStore";

const setStepMock = jest.fn((step: Step) => {});

const fixture = (setStep: (step: Step) => void) => (
  <ReduxStore>
    <ConnectOrCreate setStep={setStep} />
  </ReduxStore>
);

describe("<ConnectOrCreate />", () => {
  describe("Navigate to", () => {
    test("Create new Account", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /Create new Account/i,
      });
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
      expect(setStepMock).toBeCalledWith({ type: StepType.notice });
    });

    test("I already have a wallet", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /I already have a wallet/i,
      });
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
      expect(setStepMock).toBeCalledWith({ type: StepType.connectOptions });
    });
  });
});
