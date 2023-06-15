import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import RestoreSeedphrase from "./RestoreSeedphrase";
import { mockToast } from "../../../mocks/toast";

const setStepMock = jest.fn((step: Step) => {});
const selectRandomElementsMock = selectRandomElements as jest.Mock;

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    //
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useToast: require("../../../../src/mocks/toast").useToast,
  };
});

beforeEach(() => {
  const splitted = seedPhrase.split(" ").map((value, index) => {
    return { index, value };
  });
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
});

const fixture = (setStep: (step: Step) => void) => <RestoreSeedphrase setStep={setStep} />;

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
      inputFields.forEach(input => {
        fireEvent.change(input, { target: { value: "test" } });
      });
      await waitFor(() => {
        expect(confirmBtn).toBeEnabled();
      });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: "Mnemonic provided is invalid",
          title: "Invalid Mnemonic",
        });
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
          label: "Restored account",
          seedphrase: seedPhrase,
        },
      });
    });
  });
});
