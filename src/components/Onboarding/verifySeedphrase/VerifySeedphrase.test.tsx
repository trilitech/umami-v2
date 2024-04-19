import { VerifySeedphrase } from "./VerifySeedphrase";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";
import { selectRandomElements } from "../../../utils/tezos";
import { OnboardingStep } from "../OnboardingStep";

const goToStepMock = jest.fn((step: OnboardingStep) => {});

jest.mock("../../../utils/tezos", () => ({
  ...jest.requireActual("../../../utils/tezos"),
  selectRandomElements: jest.fn(),
}));

const selectRandomElementsMock = jest.mocked(selectRandomElements);

beforeEach(() => {
  const splitted = mnemonic1.split(" ").map((value, index) => ({
    index,
    value,
  }));
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
});

const fixture = () => (
  <VerifySeedphrase account={{ type: "mnemonic", mnemonic: mnemonic1 }} goToStep={goToStepMock} />
);

describe("<VerifySeedphrase />", () => {
  test("When no mnemonic has been entered the button is disabled", () => {
    render(fixture());

    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  test("When an invalid mnemonic has been entered the button is disabled", async () => {
    const user = userEvent.setup();

    render(fixture());

    const inputFields = screen.getAllByRole("textbox");
    for (const input of inputFields) {
      await act(() => user.type(input, "test"));
    }

    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  test("validation is working with all invalid", async () => {
    render(fixture());
    const inputFields = screen.getAllByRole("textbox");
    inputFields.forEach(input => {
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.blur(input);
    });

    await waitFor(() => {
      expect(screen.getAllByText("Word doesn't match").length).toBe(5);
    });
  });

  test("validation is working with some invalid", async () => {
    render(fixture());
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
      expect(screen.getAllByText("Word doesn't match").length).toBe(5);
    });
  });

  test("validation is working with all valid", async () => {
    render(fixture());
    const inputFields = screen.getAllByRole("textbox");

    // Enter correct value
    const splitted = mnemonic1.split(" ");

    // Enter incorrect values
    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: splitted[index] } });
      fireEvent.blur(input);
    });

    const confirmBtn = screen.getByRole("button", { name: "Continue" });

    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });

    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(goToStepMock).toHaveBeenCalledWith({
        type: "nameAccount",
        account: { type: "mnemonic", mnemonic: mnemonic1 },
      });
    });
  });
});
