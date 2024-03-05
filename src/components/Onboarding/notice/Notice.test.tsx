import { Notice } from "./Notice";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";
import { generate24WordMnemonic } from "../../../utils/mnemonic";

// TODO refactor mocks
jest.mock("../../../utils/mnemonic");

const generate24WordMnemonicMock = jest.mocked(generate24WordMnemonic);
const goToStepMock = jest.fn();

const fixture = () => <Notice goToStep={goToStepMock} />;

describe("<Eula />", () => {
  describe("When shown", () => {
    test("press 'I understand'", async () => {
      const user = userEvent.setup();
      generate24WordMnemonicMock.mockReturnValue(mnemonic1);
      render(fixture());

      await act(() => user.click(screen.getByRole("button", { name: "I understand" })));

      expect(goToStepMock).toHaveBeenCalledWith({
        type: "showSeedphrase",
        account: { type: "mnemonic", mnemonic: mnemonic1 },
      });
    });

    test("press 'I already have a Seed Phrase'", async () => {
      const user = userEvent.setup();
      render(fixture());

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
