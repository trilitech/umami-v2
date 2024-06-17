import { DerivationInfoButton } from "./DerivationInfoButton";
import { InfoModal } from "./InfoModal";
import {
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../../mocks/factories";
import { act, dynamicModalContextMock, render, screen, userEvent } from "../../../mocks/testUtils";

describe("<DerivationInfoButton />", () => {
  describe.each([mockSocialAccount(0), mockSecretKeyAccount(0), mockMultisigAccount(0)])(
    "for $type",
    account => {
      it("returns null", () => {
        render(<DerivationInfoButton account={account} />);

        expect(screen.queryByTestId("derivation-info-button")).not.toBeInTheDocument();
      });
    }
  );

  describe.each([mockLedgerAccount(0), mockMnemonicAccount(0)])("for $type", account => {
    it("renders button", () => {
      render(<DerivationInfoButton account={account} />);

      expect(screen.getByTestId("derivation-info-button")).toBeVisible();
    });

    it("opens the info modal on a click", async () => {
      const user = userEvent.setup();
      render(<DerivationInfoButton account={account} />);

      await act(() => user.click(screen.getByTestId("derivation-info-button")));

      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <InfoModal account={account} />
      );
    });
  });
});
