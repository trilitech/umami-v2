import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, TemporaryMnemonicAccountConfig } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import Eula from "./Eula";

const config = new TemporaryMnemonicAccountConfig();
config.seedphrase = seedPhrase;
const setStepMock = jest.fn((step: Step) => {});

const fixture = (setStep: (step: Step) => void) => <Eula setStep={setStep} />;

describe("<Eula />", () => {
  describe("When not accepted", () => {
    test("button is disabled", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      expect(confirmBtn).toBeDisabled();
    });
  });

  describe("When accepted", () => {
    test("button is enabled", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      expect(confirmBtn).toBeEnabled();
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
    });
  });
});
