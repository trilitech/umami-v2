import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";

import { RestoreMnemonic } from "./RestoreMnemonic";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { mockToast } from "../../../mocks/toast";
import { store } from "../../../utils/redux/store";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import { Step, StepType } from "../useOnboardingModal";

const mockNavigator = jest.mocked(
  Object.assign(navigator, {
    clipboard: {
      readText: jest.fn(),
    },
  })
);

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
  describe("default", () => {
    it("disables continue button when empty", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });

    it("selects 24 words by default", async () => {
      render(fixture(goToStepMock));
      const selectElement = screen.getByRole("combobox");
      expect(selectElement).toHaveValue("24");
    });
  });

  describe("Form validation", () => {
    it("displays error is when wrong mnemonic is entered", async () => {
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
            'Invalid Mnemonic: "test test test test test test test test test test test test test test test test test test test test test test test test"',
          status: "error",
        });
      });
    });

    it("displays error when the number of mnemonic is wrong", async () => {
      render(fixture(goToStepMock));
      const inputField = screen.getAllByRole("textbox")[0];
      mockNavigator.clipboard.readText.mockReturnValue("test test");
      fireEvent.paste(inputField);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: "the mnemonic must be 12, 15, 18, 24 words long",
          status: "error",
        });
      });
    });

    it("goes to 'Name account' step after clicking confirmation btn", async () => {
      render(fixture(goToStepMock));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      const splitted = mnemonic1.split(" ");

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
        type: StepType.nameAccount,
        account: {
          type: "mnemonic",
          mnemonic: mnemonic1,
        },
      });
    });
  });
});
