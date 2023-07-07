import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import RestoreSeedphrase from "./RestoreSeedphrase";
import { mockToast } from "../../../mocks/toast";

const goToStepMock = jest.fn((step: Step) => {});
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

const fixture = (goToStep: (step: Step) => void) => <RestoreSeedphrase goToStep={goToStep} />;

describe("<RestoreSeedphrase />", () => {
  describe("Form validation", () => {
    test("button is disabled when empty", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });

    test("error is shown when wrong mnemonic is entered", async () => {
      render(fixture(goToStepMock));
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
          description: 'Invalid mnemonic "test test test test test test test test test test test test"',
          title: "Invalid Mnemonic",
        });
      });
    });

    test("button is enabled when filled", async () => {
      render(fixture(goToStepMock));
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
        expect(goToStepMock).toBeCalledTimes(1);
      });
      expect(goToStepMock).toBeCalledWith({
        type: StepType.derivationPath,
        account: {
          type: "mnemonic",
          label: "Restored account",
          seedphrase: seedPhrase,
        },
      });
    });
  });
});
