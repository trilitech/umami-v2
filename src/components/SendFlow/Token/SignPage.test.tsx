import { Modal } from "@chakra-ui/react";

import { SignPage } from "./SignPage";
import { mockFA2Token, mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { parseContractPkh } from "../../../types/Address";
import { FA12TokenBalance, FA2TokenBalance } from "../../../types/TokenBalance";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps<{ token: FA12TokenBalance | FA2TokenBalance }>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => addAccount(mockMnemonicAccount(0)));

const mockAccount = mockMnemonicAccount(0);
const mockFAToken = mockFA2Token(0, mockAccount);
describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = makeAccountOperations(sender, mockImplicitAccount(0), [
    {
      type: "fa2",
      amount: "10",
      sender: sender.address,
      recipient: mockImplicitAccount(1).address,
      contract: parseContractPkh(mockFAToken.contract),
      tokenId: mockFAToken.tokenId,
    },
  ]);
  describe("fee", () => {
    it("displays the fee in tez", () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        executeParams: { fee: 1234567, gasLimit: 0, storageLimit: 0 },
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });

  describe("token", () => {
    it("displays the correct symbol", () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        executeParams: { fee: 1234567, gasLimit: 0, storageLimit: 0 },
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));
      expect(screen.getByTestId("token-tile")).toHaveTextContent(
        mockFAToken.metadata?.symbol as string
      );
    });

    it("displays the correct amount", () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        executeParams: { fee: 1234567, gasLimit: 0, storageLimit: 0 },
        mode: "single",
        data: { token: mockFA2Token(0, mockAccount, 1, 0) },
      };
      render(fixture(props));
      expect(screen.getByTestId("pretty-number")).toHaveTextContent("10");
    });
  });
});
