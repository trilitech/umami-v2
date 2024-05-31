import { Modal } from "@chakra-ui/react";

import { SignPage } from "./SignPage";
import { mockDelegation, mockImplicitAccount, mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { assetsSlice } from "../../../utils/redux/slices/assetsSlice";
import { store } from "../../../utils/redux/store";
import { DelegationOperation, TEZ, getLastDelegation } from "../../../utils/tezos";
import { SignPageProps } from "../utils";

jest.mock("../../../utils/tezos", () => ({
  ...jest.requireActual("../../../utils/tezos"),
  getLastDelegation: jest.fn(),
}));

const fixture = (props: SignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => addAccount(mockMnemonicAccount(0)));

describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = makeAccountOperations(sender, mockImplicitAccount(0), [
    {
      type: "delegation",
      sender: sender.address,
      recipient: mockImplicitAccount(1).address,
    },
  ]);

  it("displays the fee in tez", () => {
    const props: SignPageProps = {
      operations,
      estimation: { fee: 100, gasLimit: 0, storageLimit: 0 },
      mode: "single",
      data: undefined,
    };
    render(fixture(props));
    expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
  });

  it("displays address tile for baker", () => {
    const baker = mockImplicitAccount(1);

    store.dispatch(
      assetsSlice.actions.updateBakers([
        { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
      ])
    );

    jest
      .mocked(getLastDelegation)
      .mockResolvedValue(
        mockDelegation(
          0,
          6000000,
          baker.address.pkh,
          "Some baker",
          new Date(2020, 5, 24)
        ) as DelegationOperation
      );

    const props: SignPageProps = {
      operations,
      estimation: { fee: 100, gasLimit: 0, storageLimit: 0 },
      mode: "single",
      data: undefined,
    };
    render(fixture(props));

    expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1");
  });
});
