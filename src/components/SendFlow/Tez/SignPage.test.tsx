import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { SignPage } from "./SignPage";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
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
