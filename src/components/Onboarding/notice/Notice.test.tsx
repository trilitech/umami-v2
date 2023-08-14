import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import Notice from "./Notice";
import { generate24WordMnemonic } from "../../../utils/mnemonic";

// TODO refactor mocks
jest.mock("../../../utils/mnemonic");

const generate24WordMnemonicMock = generate24WordMnemonic as jest.Mock;
const goToStepMock = jest.fn((step: Step) => {});

const fixture = (goToStep: (step: Step) => void) => <Notice goToStep={goToStep} />;

describe("<Eula />", () => {
  describe("When shown", () => {
    test("press 'I understand'", async () => {
      generate24WordMnemonicMock.mockReturnValue(mnemonic1);
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /I understand/i });

      fireEvent.click(confirmBtn);
      expect(goToStepMock).toBeCalledWith({
        type: StepType.showSeedphrase,
        account: { type: "mnemonic", seedphrase: mnemonic1 },
      });
      expect(goToStepMock).toBeCalledTimes(1);
    });

    test("press 'I already have a Seed Phrase'", async () => {
      render(fixture(goToStepMock));
      const skipBtn = screen.getByRole("button", {
        name: /I already have a Seed Phrase/i,
      });
      fireEvent.click(skipBtn);
      expect(goToStepMock).toBeCalledWith({ type: StepType.restoreSeedphrase });
      expect(goToStepMock).toBeCalledTimes(1);
    });
  });
});
