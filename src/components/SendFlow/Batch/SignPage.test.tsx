import BigNumber from "bignumber.js";

import { SignPage } from "./SignPage";
import {
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFT,
} from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { parseContractPkh } from "../../../types/Address";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { TEZ } from "../../../utils/tezos";

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
const fixture = () => <SignPage initialFee={fee} initialOperations={operation} />;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
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
