import { Modal } from "@chakra-ui/react";
import { mockFA2Token, mockImplicitAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { SignPageProps } from "../utils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { TEZ } from "../../../utils/tezos";
import { parseContractPkh } from "../../../types/Address";
import { FATokenBalance } from "./FormPage";

const fixture = (props: SignPageProps<{ token: FATokenBalance }>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
});

const mockAccount = mockImplicitAccount(0);
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
      expect(screen.getByTestId("token-symbol")).toHaveTextContent(
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
      expect(screen.getByTestId("token-amount")).toHaveValue(10);
    });
  });
});
