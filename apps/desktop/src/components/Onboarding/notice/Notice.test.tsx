import { generate24WordMnemonic } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { Notice } from "./Notice";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  generate24WordMnemonic: jest.fn(),
}));

const generate24WordMnemonicMock = jest.mocked(generate24WordMnemonic);
const goToStepMock = jest.fn();

describe("<Eula />", () => {
  describe("When shown", () => {
    test("press 'I understand'", async () => {
      const user = userEvent.setup();
      generate24WordMnemonicMock.mockReturnValue(mnemonic1);
      render(<Notice goToStep={goToStepMock} />);

      await act(() => user.click(screen.getByRole("button", { name: "I understand" })));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: "showSeedphrase",
        account: { type: "mnemonic", mnemonic: mnemonic1 },
      });
    });

    test("press 'I already have a Seed Phrase'", async () => {
      const user = userEvent.setup();
      render(<Notice goToStep={goToStepMock} />);

      await act(() =>
        user.click(
          screen.getByRole("button", {
            name: "I already have a Seed Phrase",
          })
        )
      );

      expect(goToStepMock).toHaveBeenCalledWith({ type: "restoreMnemonic" });
    });
  });
});
