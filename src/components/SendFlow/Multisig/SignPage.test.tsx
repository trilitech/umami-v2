import { mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { TEZ } from "../../../utils/tezos";

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", () => {
      render(
        <SignPage
          type="approve"
          fee={new BigNumber(1234567)}
          signer={mockImplicitAccount(0)}
          sender={mockMultisigAccount(0)}
          operation={{
            id: "0",
            bigmapId: 0,
            rawActions: "action",
            approvals: [],
          }}
        />
      );
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });
});
