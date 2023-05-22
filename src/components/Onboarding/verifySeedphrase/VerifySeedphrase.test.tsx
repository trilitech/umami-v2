import { seedPhrase } from "../../../mocks/seedPhrase";
import { Step, TemporaryMnemonicAccountConfig } from "../useOnboardingModal";
import VerifySeedphrase from "./VerifySeedphrase";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { selectRandomElements } from "../../../utils/tezos/helpers";

const config = new TemporaryMnemonicAccountConfig();
config.seedphrase = seedPhrase;
const setStepMock = jest.fn((step: Step) => { });
const selectRandomElementsMock = selectRandomElements as jest.Mock;

// TODO refactor mocks
jest.mock("../../../utils/tezos/helpers");

beforeEach(() => {
  const splitted = seedPhrase.split(" ").map((value, index) => {
    return { index, value };
  });
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
});

const fixture = (
  setStep: (step: Step) => void,
  config: TemporaryMnemonicAccountConfig
) => (
  <VerifySeedphrase setStep={setStep} config={config} />
);

describe("<VerifySeedphrase />", () => {
  describe("Given no mnemonic has been entered", () => {
    test("button is disabled", async () => {
      render(fixture(setStepMock, config));
      console.log(selectRandomElements(seedPhrase.split(" "), 5));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });
  });

  describe("Given an invalid mnemonic has been entered", () => {
    test("button is disabled", async () => {
      render(fixture(setStepMock, config));
      const confirmBtn = screen.getByRole("button", { name: /continue/i });

      const inputFields = screen.getAllByRole("textbox");
      inputFields.forEach((input) => {
        fireEvent.change(input, { target: { value: "test" } });
      });
      await waitFor(() => {
        expect(confirmBtn).toBeDisabled();
      });
    });

    test("validation is working with all invalid", async () => {
      render(fixture(setStepMock, config));
      const inputFields = screen.getAllByRole("textbox");
      inputFields.forEach((input) => {
        fireEvent.change(input, { target: { value: "test" } });
        fireEvent.blur(input);
      });
      await waitFor(() => {
        expect(screen.getAllByText(/invalid input/i).length).toBe(5);
      });
    });

    test("validation is working with some invalid", async () => {
      render(fixture(setStepMock, config));
      const inputFields = screen.getAllByRole("textbox");

      // Enter correct value
      fireEvent.change(inputFields[0], {
        target: { value: seedPhrase.split(" ")[0] },
      });
      fireEvent.blur(inputFields[0]);

      // Enter incorrect values
      inputFields.forEach((input) => {
        fireEvent.change(input, { target: { value: "test" } });
        fireEvent.blur(input);
      });
      await waitFor(() => {
        expect(screen.getAllByText(/invalid input/i).length).toBe(4);
      });
    });

    test("validation is working with all valid", async () => {
      render(fixture(setStepMock, config));
      const inputFields = screen.getAllByRole("textbox");

      // Enter correct value
      const splitted = seedPhrase.split(" ");

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
        expect(setStepMock).toBeCalledTimes(1);
      });
    });
  });
});
