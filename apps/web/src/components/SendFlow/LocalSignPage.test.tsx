import { Modal } from "@chakra-ui/react";
import {
  makeAccountOperations,
  mockFA2Token,
  mockImplicitAccount,
  mockMnemonicAccount,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { TEZ, mockImplicitAddress, parseContractPkh } from "@umami/tezos";

import { LocalSignPage } from "./LocalSignPage";
import { type LocalSignPageProps } from "./utils";
import { render, screen, waitFor } from "../../testUtils";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

const fixture = (props: LocalSignPageProps) => (
  <Modal isOpen={true} onClose={() => {}}>
    <LocalSignPage {...props} />
  </Modal>
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0));
});

const mockAccount = mockMnemonicAccount(0);
const mockFAToken = mockFA2Token(0, mockAccount);

describe("<LocalSignPage tez/>", () => {
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      const store = makeStore();
      addTestAccount(store, mockMnemonicAccount(0));
      const props: LocalSignPageProps = {
        operations: {
          ...makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
            {
              type: "tez",
              amount: "1000000",
              recipient: mockImplicitAddress(1),
            },
          ]),
          estimates: [executeParams({ fee: 1234567 })],
        },
        operationType: "tez",
      };
      render(fixture(props), { store });

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });
});

describe("<LocalSignPage token/>", () => {
  const sender = mockImplicitAccount(0);
  const operations = {
    ...makeAccountOperations(sender, mockImplicitAccount(0), [
      {
        type: "fa2",
        amount: "10",
        sender: sender.address,
        recipient: mockImplicitAccount(1).address,
        contract: parseContractPkh(mockFAToken.contract),
        tokenId: mockFAToken.tokenId,
      },
    ]),
    estimates: [
      executeParams({
        fee: 1234567,
      }),
    ],
  };
  describe("fee", () => {
    it("displays the fee in tez", async () => {
      const props: LocalSignPageProps = {
        operations,
        operationType: "token",
        token: mockFAToken,
      };
      render(fixture(props), { store });

      await waitFor(() => expect(screen.getByTestId("fee")).toHaveTextContent(`1.234567 ${TEZ}`));
    });
  });

  describe("token", () => {
    it("displays the correct symbol", async () => {
      const props: LocalSignPageProps = {
        operations,
        operationType: "token",
        token: mockFAToken,
      };
      render(fixture(props), { store });

      await waitFor(() =>
        expect(screen.getByTestId("token-tile")).toHaveTextContent(
          mockFAToken.metadata?.symbol as string
        )
      );
    });

    it("displays the correct amount", async () => {
      const props: LocalSignPageProps = {
        operations,
        operationType: "token",
        token: mockFA2Token(0, mockAccount, 1, 0),
      };
      render(fixture(props), { store });

      await waitFor(() => expect(screen.getByTestId("pretty-number")).toHaveTextContent("10"));
    });
  });
});
