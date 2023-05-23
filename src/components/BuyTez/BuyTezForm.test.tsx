import { TezosNetwork } from "@airgap/tezos";
import { Modal } from "@chakra-ui/react";
import { render, screen } from "../../mocks/testUtils";
import { assetsActions } from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import BuyTezForm from "./BuyTezForm";

const fixture = () => (
  <Modal isOpen={true} onClose={() => {}}>
    <BuyTezForm />
  </Modal>
);

describe("<BuyTezForm />", () => {
  test("renders request Tez from faucet on ghostnet", () => {
    store.dispatch(assetsActions.updateNetwork(TezosNetwork.GHOSTNET));
    render(fixture());

    const result = screen.getByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Request Tez from faucet");
    expect(screen.queryByTestId("buy-tez-selector")).toBeNull();
  });

  test("renders Buy Tez from faucet on ghostnet", () => {
    store.dispatch(assetsActions.updateNetwork(TezosNetwork.MAINNET));
    render(fixture());

    const result = screen.getByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Buy Tez");
    expect(screen.getByTestId("buy-tez-selector")).toBeTruthy();
  });
});
