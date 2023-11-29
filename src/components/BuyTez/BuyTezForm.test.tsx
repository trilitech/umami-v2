import { Modal } from "@chakra-ui/react";

import { BuyTezForm } from "./BuyTezForm";
import { mockImplicitAccount } from "../../mocks/factories";
import { render, screen, waitFor } from "../../mocks/testUtils";
import { RawPkh } from "../../types/Address";
import { GHOSTNET } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";

const fixture = (recipient?: RawPkh) => (
  <Modal isOpen={true} onClose={() => {}}>
    <BuyTezForm recipient={recipient} />
  </Modal>
);

describe("<BuyTezForm />", () => {
  describe("mainnet", () => {
    it("renders with default recipient", async () => {
      render(fixture(mockImplicitAccount(0).address.pkh));

      await waitFor(() => {
        expect(screen.getByTestId("address-tile")).toHaveTextContent(
          mockImplicitAccount(0).address.pkh
        );
      });
    });

    it("renders Buy Tez on mainnet", async () => {
      render(fixture());

      await waitFor(() => {
        const result = screen.getByTestId("buy-tez-button");
        expect(result).toHaveTextContent("Buy Tez");
      });
      expect(screen.getByTestId("buy-tez-selector")).toBeInTheDocument();
    });
  });
  describe("ghostnet", () => {
    it("renders request Tez from faucet on ghostnet", async () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));
      render(fixture());

      await waitFor(() => {
        const result = screen.getByTestId("buy-tez-button");
        expect(result).toHaveTextContent("Request Tez from faucet");
      });
    });
  });
});
