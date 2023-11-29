import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FATokenBalance } from "./FormPage";
import { SignPage } from "./SignPage";
import { mockFA2Token, mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { parseContractPkh } from "../../../types/Address";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps<{ token: FATokenBalance }>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
});

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
      const props: SignPageProps<{ token: FATokenBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });

  describe("token", () => {
    it("displays the correct symbol", () => {
      const props: SignPageProps<{ token: FATokenBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { token: mockFAToken },
      };
      render(fixture(props));
      expect(screen.getByTestId("token-tile")).toHaveTextContent(
        mockFAToken.metadata?.symbol as string
      );
    });

    it("displays the correct amount", () => {
      const props: SignPageProps<{ token: FATokenBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { token: mockFA2Token(0, mockAccount, 1, 0) },
      };
      render(fixture(props));
      expect(screen.getByTestId("pretty-number")).toHaveTextContent("10");
    });
  });
});
