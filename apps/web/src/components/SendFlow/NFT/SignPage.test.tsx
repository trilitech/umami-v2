import {
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockNFTBalance,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, parseContractPkh } from "@umami/tezos";

import { SignPage } from "./SignPage";
import { renderInModal, screen, waitFor } from "../../../testUtils";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

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
        type: "fa2",
        amount: "1",
        sender: sender.address,
        recipient: mockImplicitAccount(1).address,
        contract: parseContractPkh(mockNFTBalance(1).contract),
        tokenId: mockNFTBalance(1).tokenId,
      },
    ]),
    estimates: [executeParams({ fee: 1234567 })],
  };

  describe("fee", () => {
    it("displays the fee in tez", async () => {
      await renderInModal(<SignPage nft={mockNFTBalance(1)} operations={operations} />, store);

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });

  describe("nft", () => {
    it("displays the correct name", async () => {
      await renderInModal(<SignPage nft={mockNFTBalance(1)} operations={operations} />, store);

      await waitFor(() =>
        expect(screen.getByTestId("nft-name")).toHaveTextContent(
          mockNFTBalance(1).metadata.name as string
        )
      );
    });

    it("displays the correct balance", async () => {
      await renderInModal(<SignPage nft={mockNFTBalance(1)} operations={operations} />, store);
      await waitFor(() =>
        expect(screen.getByTestId("nft-owned")).toHaveTextContent(mockNFTBalance(1).balance)
      );
    });
  });
});
