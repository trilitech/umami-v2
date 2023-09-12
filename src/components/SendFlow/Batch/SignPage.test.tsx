import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";
import { makeAccountOperations } from "../../sendForm/types";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";
import { useSignPageHelpers } from "../utils";
jest.mock("../utils");

const account = mockImplicitAccount(0);
const multisig = mockMultisigAccount(1);
const operation = makeAccountOperations(account, account, [
  makeMultisigApproveOrExecuteOperation(multisig.address, "execute", "3"),
]);
const fee = new BigNumber(1234567);
const fixture = () => {
  return <SignPage initialFee={fee} initialOperations={operation} />;
};

describe("<SignPage />", () => {
  beforeEach(() => {
    jest
      .mocked(useSignPageHelpers)
      .mockReturnValue({ signer: mockImplicitAccount(0), operations: operation, fee } as any);
  });
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
