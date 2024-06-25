import { makeMultisigApproveOrExecuteOperation } from "@umami/core";
import {
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFT,
} from "@umami/test-utils";
import { parseContractPkh } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { executeParams } from "../../../mocks/executeParams";
import { addAccount } from "../../../mocks/helpers";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { TEZ } from "../../../utils/tezos";

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
      contract: parseContractPkh(mockNFT(1).contract),
      tokenId: mockNFT(1).tokenId,
    },
  ]),
  estimates: [executeParams({ fee: 1234567 })],
};

const fixture = () => <SignPage initialOperations={operation} />;

beforeEach(() => addAccount(mockMnemonicAccount(0)));

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      render(fixture());

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });

  describe("number of transactions", () => {
    it("displays the correct number of transactions", async () => {
      render(fixture());

      await waitFor(() => expect(screen.getByTestId("transaction-length")).toHaveTextContent("2"));
    });
  });
});
