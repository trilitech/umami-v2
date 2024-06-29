import { Modal } from "@chakra-ui/react";
import { makeAccountOperations, mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, assetsActions, makeStore } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { type SignPageProps } from "../utils";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0));
});

describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = {
    ...makeAccountOperations(sender, mockImplicitAccount(0), [
      {
        type: "delegation",
        sender: sender.address,
        recipient: mockImplicitAccount(1).address,
      },
    ]),
    estimates: [executeParams({ fee: 1234567 })],
  };

  it("displays the fee in tez", async () => {
    const props: SignPageProps = {
      operations,
      mode: "single",
      data: undefined,
    };
    render(fixture(props), { store });

    await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
  });

  it("displays address tile for baker", async () => {
    const baker = mockImplicitAccount(1);

    store.dispatch(
      assetsActions.updateBakers([
        { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
      ])
    );

    const props: SignPageProps = {
      operations,
      mode: "single",
      data: undefined,
    };
    render(fixture(props), { store });

    await waitFor(() =>
      expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1")
    );
  });
});
