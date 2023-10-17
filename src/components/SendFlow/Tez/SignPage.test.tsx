import { Modal } from "@chakra-ui/react";
import { mockImplicitAccount, mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { SignPageProps } from "../utils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { TEZ } from "../../../utils/tezos";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockImplicitAccount(0) as any]));
});

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", () => {
      const props: SignPageProps = {
        operations: makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
          {
            type: "tez",
            amount: "1000000",
            recipient: mockImplicitAddress(1),
          },
        ]),
        fee: new BigNumber(1234567),
        mode: "single",
        data: undefined,
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });
});
