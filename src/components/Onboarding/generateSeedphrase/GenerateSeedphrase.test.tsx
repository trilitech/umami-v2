import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen } from "@testing-library/react";
import { GenerateSeedphrase } from "./GenerateSeedphrase";
import { generate24WordMnemonic } from "../../../utils/mnemonic";

// TODO refactor mocks
jest.mock("../../../utils/mnemonic");

const generate24WordMnemonicMock = generate24WordMnemonic as jest.Mock;
const setStepMock = jest.fn((step: Step) => {});

const fixture = (setStep: (step: Step) => void) => (
    <GenerateSeedphrase setStep={setStep} />
);

describe("<GenerateSeedphrase />", () => {
  describe("When shown", () => {
    test("seedphrase is displayed", async () => {
      generate24WordMnemonicMock.mockReturnValue(seedPhrase);
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", {
        name: /OK, I’ve recorded it/i,
      });
      seedPhrase.split(" ").forEach((word) => {
        expect(screen.getByText(word)).toBeInTheDocument();
      });
      expect(confirmBtn).toBeEnabled();
      fireEvent.click(confirmBtn);
      expect(setStepMock).toBeCalledTimes(1);
      expect(setStepMock).toBeCalledWith({
        type: StepType.verifySeedphrase,
        config: {
          derivationPath: undefined,
          label: undefined,
          seedphrase: seedPhrase,
        },
      });
    });
  });
});
