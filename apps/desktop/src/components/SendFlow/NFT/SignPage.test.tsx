import { Modal } from "@chakra-ui/react";
import {
  type NFTBalance,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockNFT,
} from "@umami/core";
import { addTestAccount } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, parseContractPkh } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { render, screen, waitFor } from "../../../mocks/testUtils";
import { type SignPageProps } from "../utils";

const fixture = (props: SignPageProps<{ nft: NFTBalance }>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SignPage {...props} />
  </Modal>
);

beforeEach(() => addTestAccount(mockMnemonicAccount(0)));

describe("<SignPage />", () => {
  const sender = mockImplicitAccount(0);
  const operations = {
    ...makeAccountOperations(sender, mockImplicitAccount(0), [
      {
        type: "fa2",
        amount: "1",
        sender: sender.address,
        recipient: mockImplicitAccount(1).address,
        contract: parseContractPkh(mockNFT(1).contract),
        tokenId: mockNFT(1).tokenId,
      },
    ]),
    estimates: [executeParams({ fee: 1234567 })],
  };
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });
  describe("nft", () => {
    it("displays the correct name", async () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));

      await waitFor(() =>
        expect(screen.getByTestId("nft-name")).toHaveTextContent(mockNFT(1).metadata.name as string)
      );
    });

    it("displays the correct balance", async () => {
      const props: SignPageProps<{ nft: NFTBalance }> = {
        operations,
        mode: "single",
        data: { nft: mockNFT(1) },
      };
      render(fixture(props));
      await waitFor(() =>
        expect(screen.getByTestId("nft-owned")).toHaveTextContent(mockNFT(1).balance)
      );
    });
  });
});
