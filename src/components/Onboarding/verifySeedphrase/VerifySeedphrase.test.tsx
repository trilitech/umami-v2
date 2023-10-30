import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { Step, StepType } from "../useOnboardingModal";
import VerifySeedphrase from "./VerifySeedphrase";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";

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
  <VerifySeedphrase goToStep={goToStep} account={{ type: "mnemonic", mnemonic: mnemonic1 }} />
);

describe("<VerifySeedphrase />", () => {
  test("When no mnemonic has been entered the button is disabled", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
    });
  });

  test("When an invalid mnemonic has been entered the button is disabled", async () => {
    render(fixture(goToStepMock));
    const confirmBtn = screen.getByRole("button", { name: /continue/i });

    const inputFields = screen.getAllByRole("textbox");
    inputFields.forEach(input => {
      fireEvent.change(input, { target: { value: "test" } });
    });
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
    });
  });

  test("validation is working with all invalid", async () => {
    render(fixture(goToStepMock));
    const inputFields = screen.getAllByRole("textbox");
    inputFields.forEach(input => {
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.blur(input);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/invalid input/i).length).toBe(5);
    });
  });

  test("validation is working with some invalid", async () => {
    render(fixture(goToStepMock));
    const inputFields = screen.getAllByRole("textbox");

    // Enter correct value
    fireEvent.change(inputFields[0], {
      target: { value: mnemonic1.split(" ")[0] },
    });
    fireEvent.blur(inputFields[0]);

    // Enter incorrect values
    inputFields.forEach(input => {
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.blur(input);
    });
    await waitFor(() => {
      expect(screen.getAllByText(/invalid input/i).length).toBe(5);
    });
  });

  test("validation is working with all valid", async () => {
    render(fixture(goToStepMock));
    const inputFields = screen.getAllByRole("textbox");

    // Enter correct value
    const splitted = mnemonic1.split(" ");

    // Enter incorrect values
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: splitted[index] } });
      fireEvent.blur(input);
    });

    const confirmBtn = screen.getByRole("button", { name: /continue/i });

    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });

    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(goToStepMock).toBeCalledTimes(1);
    });
    expect(goToStepMock).toBeCalledWith({
      type: StepType.nameAccount,
      account: { type: "mnemonic", mnemonic: mnemonic1 },
    });
  });
});
