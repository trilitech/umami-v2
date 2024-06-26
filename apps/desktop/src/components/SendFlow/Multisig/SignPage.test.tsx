import { waitFor } from "@testing-library/react";
import {
  makeAccountOperations,
  makeMultisigApproveOrExecuteOperation,
  mockImplicitAccount,
  mockMultisigAccount,
} from "@umami/core";
import { executeParams } from "@umami/test-utils";
import { TEZ } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { render, screen } from "../../../mocks/testUtils";

const fixture = () => {
  const account = mockImplicitAccount(0);
  const multisig = mockMultisigAccount(1);
  const operation = {
    ...makeAccountOperations(account, account, [
      makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
    ]),
    estimates: [
      executeParams({
        fee: 1234567,
      }),
    ],
  };
  return (
    <SignPage actionType="approve" operation={operation} signer={account} transactionCount={1} />
  );
};

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

      await waitFor(() => expect(screen.getByTestId("transaction-length")).toHaveTextContent("1"));
    });
  });
});
