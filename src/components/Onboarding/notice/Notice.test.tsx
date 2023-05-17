import { seedPhrase } from "../../../mocks/seedPhrase";
import {
  Step,
  StepType,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import Notice from "./Notice";

const config = new TemporaryMnemonicAccountConfig();
config.seedphrase = seedPhrase;
const setStepMock = jest.fn((step: Step) => {});

const fixture = (setStep: (step: Step) => void) => <Notice setStep={setStep} />;

describe("<Eula />", () => {
  describe("When shown", () => {
    test("press 'I understand'", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /I understand/i });
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledWith({ type: StepType.generateSeedphrase });
      expect(setStepMock).toBeCalledTimes(1);
    });
    test("press 'I already have a Seed Phrase'", async () => {
      render(fixture(setStepMock));
      const skipBtn = screen.getByRole("button", {
        name: /I already have a Seed Phrase/i,
      });
      fireEvent.click(skipBtn);
      expect(setStepMock).toBeCalledWith({ type: StepType.restoreSeedphrase });
      expect(setStepMock).toBeCalledTimes(1);
    });
  });
});
