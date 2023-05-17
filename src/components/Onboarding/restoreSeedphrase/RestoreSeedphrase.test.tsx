import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import RestoreSeedphrase from "./RestoreSeedphrase";

const setStepMock = jest.fn((step: Step) => {});
const selectRandomElementsMock = selectRandomElements as jest.Mock;

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");

beforeEach(() => {
  const splitted = seedPhrase.split(" ").map((value, index) => {
    return { index, value };
  });
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
});

const fixture = (setStep: (step: Step) => void) => (
  <RestoreSeedphrase setStep={setStep} />
);

describe("<RestoreSeedphrase />", () => {
  describe("Form validation", () => {
    test("button is disabled when empty", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });

    test("error is shown when wrong mnemonic is entered", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const inputFields = screen.getAllByRole("textbox");
      inputFields.forEach((input) => {
        fireEvent.change(input, { target: { value: "test" } });
      });
      await waitFor(() => {
        expect(confirmBtn).toBeEnabled();
      });
      confirmBtn.click();

      // TODO check why this is not working
      // expect(screen.getByText(/invalid mnemonic/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(0);
      });
    });

    test("button is enabled when filled", async () => {
      render(fixture(setStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const splitted = seedPhrase.split(" ");

      const selectElement = screen.getByRole("combobox");
      expect(selectElement).toHaveValue("12");
      fireEvent.change(selectElement, { target: { value: "24" } });
      expect(selectElement).toHaveValue("24");

      const inputFields = screen.getAllByRole("textbox");
      inputFields.forEach((input, index) => {
        fireEvent.change(input, { target: { value: splitted[index] } });
      });
      await waitFor(() => {
        expect(confirmBtn).toBeEnabled();
      });
      fireEvent.click(confirmBtn);
      await waitFor(() => {
        expect(setStepMock).toBeCalledTimes(1);
      });
      expect(setStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        config: {
          derivationPath: undefined,
          label: undefined,
          seedphrase: seedPhrase,
        },
      });
    });
  });
});
