import { Modal } from "@chakra-ui/react";

import { SignPage } from "./SignPage";
import { executeParams } from "../../../mocks/executeParams";
import { mockFA2Token, mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen, waitFor } from "../../../mocks/testUtils";
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
  const operations = {
    ...makeAccountOperations(sender, mockImplicitAccount(0), [
      {
        type: "fa2",
        amount: "10",
        sender: sender.address,
        recipient: mockImplicitAccount(1).address,
        contract: parseContractPkh(mockFAToken.contract),
        tokenId: mockFAToken.tokenId,
      },
    ]),
    estimates: [
      executeParams({
        fee: 1234567,
      }),
    ],
  };
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });

  describe("token", () => {
    it("displays the correct symbol", async () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));

      await waitFor(() =>
        expect(screen.getByTestId("token-tile")).toHaveTextContent(
          mockFAToken.metadata?.symbol as string
        )
      );
    });

    it("displays the correct amount", async () => {
      const props: SignPageProps<{
        token: FA12TokenBalance | FA2TokenBalance;
      }> = {
        operations,
        mode: "single",
        data: { token: mockFA2Token(0, mockAccount, 1, 0) },
      };
      render(fixture(props));

      await waitFor(() => expect(screen.getByTestId("pretty-number")).toHaveTextContent("10"));
    });
  });
});
