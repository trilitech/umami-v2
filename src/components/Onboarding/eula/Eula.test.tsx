import { fireEvent, render, screen } from "@testing-library/react";

import { Eula } from "./Eula";
import { Step } from "../useOnboardingModal";

const setStepMock = jest.fn((step: Step) => {});

const fixture = (setStep: (step: Step) => void) => <Eula goToStep={setStep} />;

describe("<Eula />", () => {
  describe("When not accepted", () => {
    test("button is disabled", () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      expect(confirmBtn).toBeDisabled();
    });
  });

  describe("When accepted", () => {
    test("button is enabled", () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(confirmBtn).toBeEnabled();
      fireEvent.click(confirmBtn);
      expect(setStepMock).toHaveBeenCalledTimes(1);
    });
  });
});
