import { mockImplicitAccount, mockMultisigAccount, mockNFT } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { parseContractPkh } from "../../../types/Address";

const account = mockImplicitAccount(0);
const multisig = mockMultisigAccount(1);
const operation = makeAccountOperations(account, account, [
  makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
  {
    type: "fa2",
    amount: "1",
    sender: account.address,
    recipient: mockImplicitAccount(1).address,
    contract: parseContractPkh(mockNFT(1).contract),
    tokenId: mockNFT(1).tokenId,
  },
]);

const fee = BigNumber(1234567);
const fixture = () => {
  return <SignPage initialFee={fee} initialOperations={operation} />;
};

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockImplicitAccount(0) as any]));
});

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", () => {
      render(fixture());
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });

  describe("number of transactions", () => {
    it("displays the correct number of transactions", () => {
      render(fixture());
      expect(screen.getByTestId("transaction-length")).toHaveTextContent("2");
    });
  });
});
