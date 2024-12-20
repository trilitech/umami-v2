import { selectRandomElements } from "@umami/core";
import { mnemonic1 } from "@umami/test-utils";

import { VerifySeedphrase } from "./VerifySeedphrase";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";

const goToStepMock = jest.fn();

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
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

    const inputFields = screen.getAllByTestId("mnemonic-input");
    for (const input of inputFields) {
      await act(() => user.type(input, "test"));
    }

    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });

  test("validation is working with all invalid", async () => {
    render(fixture());
    const inputFields = screen.getAllByTestId("mnemonic-input");
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
    const inputFields = screen.getAllByTestId("mnemonic-input");

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
    const inputFields = screen.getAllByTestId("mnemonic-input");

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
