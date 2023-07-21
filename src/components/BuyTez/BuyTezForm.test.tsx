import { Modal } from "@chakra-ui/react";
import { render, screen } from "../../mocks/testUtils";
import { TezosNetwork } from "../../types/TezosNetwork";
import { assetsActions } from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import BuyTezForm from "./BuyTezForm";

const fixture = () => (
  <Modal isOpen={true} onClose={() => {}}>
    <BuyTezForm />
  </Modal>
);

describe("<BuyTezForm />", () => {
  test("renders request Tez from faucet on ghostnet", async () => {
    store.dispatch(assetsActions.updateNetwork(TezosNetwork.GHOSTNET));
    render(fixture());

    // Async findBy because otherwise we get act warning since store.dispatch is async
    const result = await screen.findByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Request Tez from faucet");
  });

  test("renders Buy Tez from faucet on ghostnet", async () => {
    store.dispatch(assetsActions.updateNetwork(TezosNetwork.MAINNET));
    render(fixture());

    const result = await screen.findByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Buy Tez");
    expect(screen.getByTestId("buy-tez-selector")).toBeTruthy();
  });
});
