import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { Step, StepType } from "../useOnboardingModal";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import RestoreMnemonic from "./RestoreMnemonic";
import { mockToast } from "../../../mocks/toast";
import { Provider } from "react-redux";
import store from "../../../utils/redux/store";

const goToStepMock = jest.fn((step: Step) => {});
const selectRandomElementsMock = jest.mocked(selectRandomElements);

jest.mock("../../../utils/tezos/helpers");

beforeEach(() => {
  const splitted = mnemonic1.split(" ").map((value, index) => {
    return { index, value };
  });
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
});

const fixture = (goToStep: (step: Step) => void) => (
  <Provider store={store}>
    <RestoreMnemonic goToStep={goToStep} />;
  </Provider>
);

describe("<RestoreMnemonic />", () => {
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
          description:
            'Invalid mnemonic "test test test test test test test test test test test test"',
          status: "error",
          title: "Invalid Mnemonic",
        });
      });
    });

    test("button is enabled when filled", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const splitted = mnemonic1.split(" ");

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
          mnemonic: mnemonic1,
        },
      });
    });
  });
});
