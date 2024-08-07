import {
  makeAccountOperations,
  makeMultisigApproveOrExecuteOperation,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFTBalance,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, parseContractPkh } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { render, screen, waitFor } from "../../../mocks/testUtils";

const account = mockImplicitAccount(0);
const multisig = mockMultisigAccount(1);
const operation = {
  ...makeAccountOperations(account, account, [
    makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
    {
      type: "fa2",
      amount: "1",
      sender: account.address,
      recipient: mockImplicitAccount(1).address,
      contract: parseContractPkh(mockNFTBalance(1).contract),
      tokenId: mockNFTBalance(1).tokenId,
    },
  ]),
  estimates: [executeParams({ fee: 1234567 })],
};

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0));
});

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      render(<SignPage initialOperations={operation} />, { store });

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });

  describe("number of transactions", () => {
    it("displays the correct number of transactions", async () => {
      render(<SignPage initialOperations={operation} />, { store });

      await waitFor(() => expect(screen.getByTestId("transaction-length")).toHaveTextContent("2"));
    });
  });
});
