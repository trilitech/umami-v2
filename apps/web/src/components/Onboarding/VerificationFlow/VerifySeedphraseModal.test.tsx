import { type MnemonicAccount, mockMnemonicAccount, selectRandomElements } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { VerifySeedphraseModal } from "./VerifySeedphraseModal";
import { act, fireEvent, renderInModal, screen, userEvent, waitFor } from "../../../testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  selectRandomElements: jest.fn(),
}));

const selectRandomElementsMock = jest.mocked(selectRandomElements);

let store: UmamiStore;

beforeEach(() => {
  const splitted = mnemonic1.split(" ").map((value, index) => ({
    index,
    value,
  }));
  selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));

  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
});

const fixture = () => <VerifySeedphraseModal seedPhrase={mnemonic1} />;

describe("<VerifySeedphraseModal />", () => {
  test("when no mnemonic has been entered the button is disabled", async () => {
    await renderInModal(fixture(), store);

    expect(screen.getByRole("button", { name: "Verify" })).toBeDisabled();
  });

  test("when an invalid mnemonic has been entered the button is disabled", async () => {
    const user = userEvent.setup();

    await renderInModal(fixture(), store);

    const inputFields = screen.getAllByTestId("mnemonic-input");

    for (const input of inputFields) {
      await act(() => user.type(input, "test"));
    }

    expect(screen.getByRole("button", { name: "Verify" })).toBeDisabled();
  });

  test("validation is working with all invalid", async () => {
    await renderInModal(fixture(), store);
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
    await renderInModal(fixture(), store);
    const inputFields = screen.getAllByTestId("mnemonic-input");

    fireEvent.change(inputFields[0], {
      target: { value: mnemonic1.split(" ")[0] },
    });
    fireEvent.blur(inputFields[0]);

    inputFields.forEach(input => {
      fireEvent.change(input, { target: { value: "test" } });
      fireEvent.blur(input);
    });
    await waitFor(() => {
      expect(screen.getAllByText("Word doesn't match").length).toBe(5);
    });
  });

  test("validation is working with all valid", async () => {
    await renderInModal(fixture(), store);
    const inputFields = screen.getAllByTestId("mnemonic-input");
    const splitted = mnemonic1.split(" ");

    inputFields.forEach((input, index) => {
      fireEvent.change(input, { target: { value: splitted[index] } });
      fireEvent.blur(input);
    });

    const confirmBtn = screen.getByRole("button", { name: "Verify" });

    await waitFor(() => {
      expect(confirmBtn).toBeEnabled();
    });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect((store.getState().accounts.items[0] as MnemonicAccount).isVerified).toBe(true);
    });
  });
});
