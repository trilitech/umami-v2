import {
  type Token,
  fromRawToken,
  mockLedgerAccount,
  tokenTransferFixture,
  transactionFixture,
} from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  makeStore,
  networksActions,
  useGetOperationDestination,
} from "@umami/state";
import { ghostnetThezard } from "@umami/test-utils";
import { DefaultNetworks, TEZ, formatPkh, mockImplicitAddress } from "@umami/tezos";
import { type TokenTransferOperation, type TransactionOperation } from "@umami/tzkt";

import { TokenTransferTile } from "./TokenTransferTile";
import { render, screen } from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetOperationDestination: jest.fn(),
}));

const fixture = (tokenTransfer: TokenTransferOperation, operation?: TransactionOperation) => (
  <TokenTransferTile
    operation={operation}
    token={fromRawToken(tokenTransfer.token) as Token}
    tokenTransfer={tokenTransfer}
  />
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  jest.mocked(useGetOperationDestination).mockReturnValue("outgoing");
});

describe("<TokenTransferTile />", () => {
  describe("sign", () => {
    it("shows '+' for incoming transactions", () => {
      jest.mocked(useGetOperationDestination).mockReturnValue("incoming");
      addTestAccount(store, mockLedgerAccount(1));

      render(fixture(tokenTransferFixture()), { store });

      expect(screen.getByTestId("incoming-arrow")).toBeInTheDocument();
      expect(screen.queryByTestId("outgoing-arrow")).not.toBeInTheDocument();
      expect(screen.getByTestId("title")).toHaveTextContent("+0.000000000500 uUSD");
    });

    it("shows '-' for outgoing transactions", () => {
      addTestAccount(store, mockLedgerAccount(1));

      render(
        fixture(
          tokenTransferFixture({
            from: { address: mockLedgerAccount(1).address.pkh },
            to: { address: mockImplicitAddress(2).pkh },
          })
        ),
        { store }
      );

      expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toHaveTextContent("-0.000000000500 uUSD");
    });

    it("shows '-' if sender and target are both owned", () => {
      addTestAccount(store, mockLedgerAccount(0));
      addTestAccount(store, mockLedgerAccount(1));

      render(
        fixture(
          tokenTransferFixture({
            to: { address: mockLedgerAccount(0).address.pkh },
            from: { address: mockLedgerAccount(1).address.pkh },
          })
        ),
        { store }
      );

      expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toHaveTextContent("-0.000000000500 uUSD");
    });
  });

  describe("amount", () => {
    it("does not display decimal if not needed", () => {
      addTestAccount(store, mockLedgerAccount(1));
      const tokenTransfer = tokenTransferFixture({
        from: { address: mockLedgerAccount(1).address.pkh },
      });
      delete tokenTransfer.token.metadata.decimals;

      render(fixture(tokenTransfer), { store });

      expect(screen.getByTestId("title")).toHaveTextContent("-500 uUSD");
    });

    it("displays decimal if needed", () => {
      addTestAccount(store, mockLedgerAccount(1));
      const tokenTransfer = tokenTransferFixture({
        from: { address: mockLedgerAccount(1).address.pkh },
      });
      tokenTransfer.token.metadata.decimals = 2;

      render(fixture(tokenTransfer), { store });

      expect(screen.getByTestId("title")).toHaveTextContent("-5.00 uUSD");
    });
  });

  describe("token name", () => {
    describe("NFT", () => {
      it("shows the token name", () => {
        const tokenTransfer = tokenTransferFixture();
        tokenTransfer.token.metadata = {
          ...tokenTransfer.token.metadata,
          name: "some-name",
          decimals: undefined,
          displayUri: "some-uri",
        };
        render(fixture(tokenTransfer), { store });

        expect(screen.getByTestId("title")).toHaveTextContent("some-name");
      });

      it("shows the default token name if the token name is empty", () => {
        const tokenTransfer = tokenTransferFixture();
        tokenTransfer.token.metadata = {
          ...tokenTransfer.token.metadata,
          name: undefined,
          decimals: undefined,
          displayUri: "some-uri",
        };

        render(fixture(tokenTransfer), { store });

        expect(screen.getByTestId("title")).toHaveTextContent("NFT");
      });
    });

    describe.each([
      { standard: "fa1.2", defaultSymbol: "FA1.2" },
      { standard: "fa2", defaultSymbol: "FA2" },
    ])("$standard", ({ standard, defaultSymbol }) => {
      const tokenTransfer = tokenTransferFixture();
      tokenTransfer.token.standard = standard;
      tokenTransfer.token.metadata.name = "some-name";

      it("shows the token symbol", () => {
        render(fixture(tokenTransfer), { store });

        expect(screen.getByTestId("title")).toHaveTextContent("uUSD");
      });

      it("shows the default token symbol if the token symbol is empty and name is present", () => {
        tokenTransfer.token.metadata.symbol = undefined;
        tokenTransfer.token.metadata.name = undefined;
        render(fixture(tokenTransfer), { store });

        expect(screen.getByTestId("title")).toHaveTextContent(defaultSymbol);
      });
    });
  });

  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      it("links to the operation page on tzkt", () => {
        store.dispatch(networksActions.setCurrent(network));

        render(fixture(tokenTransferFixture()), { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/transactions/56789`
        );
      });
    });
  });

  it("displays timestamp", () => {
    render(fixture(tokenTransferFixture({ timestamp: "2021-01-02T00:00:00.000Z" })), {
      store,
    });

    expect(screen.getByTestId("timestamp")).toHaveTextContent("2 Jan 2021");
  });

  describe("pills", () => {
    beforeEach(() => addTestAccount(store, mockLedgerAccount(0)));

    it("shows both if sender is an owned account", () => {
      render(
        fixture(
          tokenTransferFixture({
            from: { address: mockLedgerAccount(0).address.pkh },
            to: { address: mockLedgerAccount(1).address.pkh },
          })
        ),
        { store }
      );

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent(
        formatPkh(mockLedgerAccount(1).address.pkh)
      );
    });

    it("shows both if target is an owned account", () => {
      render(
        fixture(
          tokenTransferFixture({
            to: { address: mockLedgerAccount(0).address.pkh },
            from: { address: mockLedgerAccount(1).address.pkh },
          })
        ),
        { store }
      );

      expect(screen.getByTestId("from")).toHaveTextContent(
        formatPkh(mockLedgerAccount(1).address.pkh)
      );
      expect(screen.getByTestId("to")).toHaveTextContent("Account");
    });

    it("shows both if sender and target are owned accounts", () => {
      render(
        fixture(
          tokenTransferFixture({
            to: { address: mockLedgerAccount(0).address.pkh },
            from: { address: mockLedgerAccount(0).address.pkh },
          })
        ),
        { store }
      );

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent("Account");
    });
  });

  describe.each([
    { type: "NFT", transfer: tokenTransferFixture({ token: ghostnetThezard.token }) },
    { type: "token", transfer: tokenTransferFixture() },
  ])("for $type", ({ transfer }) => {
    afterEach(() => jest.restoreAllMocks());

    it("renders internal prefix for internal operations", () => {
      jest.mocked(useGetOperationDestination).mockReturnValue("unrelated");

      render(fixture(transfer), { store });

      expect(screen.getByTestId("internal-prefix")).toBeVisible();
    });

    it("does not render internal prefix for normal operations", () => {
      jest.mocked(useGetOperationDestination).mockReturnValue("incoming");
      render(fixture(transfer), { store });

      expect(screen.queryByTestId("internal-prefix")).not.toBeInTheDocument();
    });
  });

  describe("fee", () => {
    it("renders nothing if the fee isn't paid by the user", () => {
      render(
        fixture(
          tokenTransferFixture(),
          transactionFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        ),
        { store }
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("renders if there is any fee paid by the user", () => {
      addTestAccount(store, mockLedgerAccount(0));
      render(
        fixture(
          tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } }),
          transactionFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        ),
        { store }
      );

      expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
    });

    it("renders nothing if the fee is absent", () => {
      render(
        fixture(
          tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } }),
          transactionFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
            bakerFee: 0,
            storageFee: 0,
            allocationFee: 0,
          })
        ),
        { store }
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });
  });

  it("shows operation type", () => {
    render(fixture(tokenTransferFixture()), { store });

    expect(screen.getByTestId("operation-type")).toHaveTextContent("Token Transfer");
  });
});
