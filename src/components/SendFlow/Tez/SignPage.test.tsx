import { Modal } from "@chakra-ui/react";

import { SignPage } from "./SignPage";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  addAccount(mockMnemonicAccount(0));
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
        executeParams: { fee: 1234567, gasLimit: 0, storageLimit: 0 },
        mode: "single",
        data: undefined,
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });
});
