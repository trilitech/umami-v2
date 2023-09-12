import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";
import { makeAccountOperations } from "../../sendForm/types";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";
import { useSignPageHelpers } from "../utils";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";

const account = mockImplicitAccount(0);
const multisig = mockMultisigAccount(1);
const operation = makeAccountOperations(account, account, [
  makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
]);
const fee = new BigNumber(1234567);
const fixture = () => {
  return <SignPage initialFee={fee} initialOperations={operation} />;
};

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
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
      expect(screen.getByTestId("transaction-length")).toHaveTextContent("1");
    });
  });
});
