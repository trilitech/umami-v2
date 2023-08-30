import { Modal } from "@chakra-ui/react";
import { mockImplicitAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeFormOperations } from "../../sendForm/types";
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
  store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
});

describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = makeFormOperations(sender, mockImplicitAccount(0), [
    {
      type: "undelegation",
      sender: sender.address,
    },
  ]);
  describe("fee", () => {
    it("displays the fee in tez", () => {
      const props: SignPageProps = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: undefined,
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });
});
