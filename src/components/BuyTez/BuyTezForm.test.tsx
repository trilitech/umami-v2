import { Modal } from "@chakra-ui/react";
import { render, screen } from "../../mocks/testUtils";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";
import BuyTezForm from "./BuyTezForm";
import { GHOSTNET, MAINNET } from "../../types/Network";

const fixture = () => (
  <Modal isOpen={true} onClose={() => {}}>
    <BuyTezForm />
  </Modal>
);

describe("<BuyTezForm />", () => {
  test("renders request Tez from faucet on ghostnet", async () => {
    store.dispatch(assetsActions.updateNetwork(GHOSTNET));
    render(fixture());

    // Async findBy because otherwise we get act warning since store.dispatch is async
    const result = await screen.findByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Request Tez from faucet");
  });

  test("renders Buy Tez from faucet on ghostnet", async () => {
    store.dispatch(assetsActions.updateNetwork(MAINNET));
    render(fixture());

    const result = await screen.findByTestId("buy-tez-button");
    expect(result).toHaveTextContent("Buy Tez");
    expect(screen.getByTestId("buy-tez-selector")).toBeInTheDocument();
  });
});
