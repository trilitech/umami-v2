import { Modal } from "@chakra-ui/react";
import { mockImplicitAccount, mockNFT } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { SignPageProps } from "../utils";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import store from "../../../utils/redux/store";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { TEZ } from "../../../utils/tezos";
import { parseContractPkh } from "../../../types/Address";
import { NFTBalance } from "../../../types/TokenBalance";

const fixture = (props: SignPageProps<{ nft: NFTBalance }>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockImplicitAccount(0) as any]));
});

describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = makeAccountOperations(sender, mockImplicitAccount(0), [
    {
      type: "fa2",
      amount: "1",
      sender: sender.address,
      recipient: mockImplicitAccount(1).address,
      contract: parseContractPkh(mockNFT(1).contract),
      tokenId: mockNFT(1).tokenId,
    },
  ]);
  describe("fee", () => {
    it("displays the fee in tez", () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));
      expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`);
    });
  });
  describe("nft", () => {
    it("displays the correct name", () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));
      expect(screen.getByTestId("nft-name")).toHaveTextContent(mockNFT(1).metadata.name as string);
    });

    it("displays the correct balance", () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        fee: new BigNumber(1234567),
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));
      expect(screen.getByTestId("nft-owned")).toHaveTextContent(mockNFT(1).balance);
    });
  });
});
