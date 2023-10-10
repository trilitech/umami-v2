import { Modal } from "@chakra-ui/react";
import { mockDelegation, mockImplicitAccount } from "../../../mocks/factories";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { SignPageProps } from "../utils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { DelegationOperation, TEZ, getLastDelegation } from "../../../utils/tezos";
import assetsSlice from "../../../utils/redux/slices/assetsSlice";

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
      fee: new BigNumber(1234567),
      mode: "single",
      data: undefined,
    };
    render(fixture(props));
    expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
  });

  it("displays the baker tile", async () => {
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
      fee: new BigNumber(1234567),
      mode: "single",
      data: undefined,
    };
    render(fixture(props));

    await waitFor(() => {
      expect(screen.getByTestId("baker-tile")).toBeInTheDocument();
    });
  });
});
