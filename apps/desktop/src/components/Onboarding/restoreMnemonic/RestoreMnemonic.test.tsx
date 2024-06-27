import { selectRandomElements } from "@umami/core";
import { mnemonic1 } from "@umami/test-utils";

import { RestoreMnemonic } from "./RestoreMnemonic";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";

const goToStepMock = jest.fn();

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  selectRandomElements: jest.fn(),
}));
const selectRandomElementsMock = jest.mocked(selectRandomElements);

const fixture = () => <RestoreMnemonic goToStep={goToStepMock} />;

describe("<RestoreMnemonic />", () => {
  beforeEach(() => {
    const splitted = mnemonic1.split(" ").map((value, index) => ({ index, value }));
    selectRandomElementsMock.mockReturnValue(splitted.slice(0, 5));
  });

  describe("default", () => {
    it("disables continue button when empty", () => {
      render(fixture());

      expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    });

    it("selects 24 words by default", () => {
      render(fixture());

      expect(screen.getByRole("combobox")).toHaveValue("24");
    });
  });

  describe("Form validation", () => {
    it("displays error is when wrong mnemonic is entered", async () => {
      const user = userEvent.setup();
      render(fixture());

      const confirmBtn = screen.getByRole("button", { name: "Continue" });
      const inputFields = screen.getAllByRole("textbox");

      for (const input of inputFields) {
        await act(() => user.type(input, "test"));
      }

      expect(confirmBtn).toBeEnabled();
      await act(() => user.click(confirmBtn));

      expect(mockToast).toHaveBeenCalledWith({
        description:
          'Invalid Mnemonic: "test test test test test test test test test test test test test test test test test test test test test test test test"',
        status: "error",
        isClosable: true,
      });
    });

    it("displays error when the number of mnemonic is wrong", async () => {
      const user = userEvent.setup();
      render(fixture());

      await act(() => user.click(screen.getAllByRole("textbox")[0]));
      await act(() => user.paste("test test"));

      expect(mockToast).toHaveBeenCalledWith({
        description: "the mnemonic must be 12, 15, 18, 24 words long",
        status: "error",
        isClosable: true,
      });
    });

    it("goes to 'Name account' step after clicking confirmation btn", async () => {
      const user = userEvent.setup();
      render(fixture());

      const confirmBtn = screen.getByRole("button", { name: "Continue" });
      const splitted = mnemonic1.split(" ");
      const inputFields = screen.getAllByRole("textbox");

      for (const [i, input] of inputFields.entries()) {
        await act(() => user.type(input, splitted[i]));
      }

      expect(confirmBtn).toBeEnabled();

      await act(() => user.click(confirmBtn));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: "nameAccount",
        account: {
          type: "mnemonic",
          mnemonic: mnemonic1,
        },
      });
    });
  });
});
