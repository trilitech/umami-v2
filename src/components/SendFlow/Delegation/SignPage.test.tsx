import { Modal } from "@chakra-ui/react";

import { SignPage } from "./SignPage";
import { executeParams } from "../../../mocks/executeParams";
import { mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { assetsSlice } from "../../../utils/redux/slices/assetsSlice";
import { store } from "../../../utils/redux/store";
import { TEZ } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => addAccount(mockMnemonicAccount(0)));

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
    render(fixture(props));

    await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
  });

  it("displays address tile for baker", async () => {
    const baker = mockImplicitAccount(1);

    store.dispatch(
      assetsSlice.actions.updateBakers([
        { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
      ])
    );

    const props: SignPageProps = {
      operations,
      mode: "single",
      data: undefined,
    };
    render(fixture(props));

    await waitFor(() =>
      expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1")
    );
  });
});
