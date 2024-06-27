import { Modal } from "@chakra-ui/react";
import { makeAccountOperations, mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { addTestAccount } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, mockImplicitAddress } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { type SignPageProps } from "../utils";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  addTestAccount(mockMnemonicAccount(0));
});

describe("<SignPage />", () => {
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      const props: SignPageProps = {
        operations: {
          ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
            {
              type: "tez",
              amount: "1000000",
              recipient: mockImplicitAddress(1),
            },
          ]),
          estimates: [executeParams({ fee: 1234567 })],
        },
        mode: "single",
        data: undefined,
      };
      render(fixture(props));

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });
});
