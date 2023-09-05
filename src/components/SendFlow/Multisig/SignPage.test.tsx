import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";
import { multisigOperation } from "../../../mocks/multisig";

const fixture = () => (
  <SignPage
    type="approve"
    fee={new BigNumber(1234567)}
    signer={mockImplicitAccount(0)}
    sender={mockMultisigAccount(0)}
    operation={multisigOperation}
  />
);

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
