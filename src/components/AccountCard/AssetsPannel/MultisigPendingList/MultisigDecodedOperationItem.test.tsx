import { mockContract, mockPkh } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import { assetsActions, TokenBalancePayload } from "../../../../utils/store/assetsSlice";
import { store } from "../../../../utils/store/store";
import MultisigDecodedOperationItem from "./MultisigDecodedOperationItem";

const { reset, updateAssets } = assetsActions;
afterEach(() => {
  store.dispatch(reset());
});

describe("<MultisigDecodedOperationItem/>", () => {
  it("displays delegate", () => {
    render(<MultisigDecodedOperationItem operation={{ type: "delegation" }} />);

    expect(screen.getByTestId("decoded-item-delegate")).toHaveTextContent("Undelegate");
  });

  it("amount renders correctly for tez", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{ type: "tez", recipient: mockPkh(0), amount: "1000000" }}
      />
    );

    expect(screen.getByTestId("decoded-tez-amount")).toHaveTextContent("-1 ꜩ");
  });

  it("Non NFT FA tokens amount renders correctly", () => {
    const mockContractPkh = mockContract(0);

    const mockBalancePlayload: TokenBalancePayload = {
      pkh: "mockPkh",
      tokens: [
        {
          balance: "1",
          token: {
            contract: { address: mockContractPkh },
            standard: "fa2",
            tokenId: "0",
            metadata: {
              decimals: "2",
              symbol: "mockSymbol",
            },
          },
        },
      ],
    };
    store.dispatch(updateAssets([mockBalancePlayload]));

    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "fa2",
          recipient: mockPkh(0),
          amount: "300",
          sender: "sender",
          contract: mockContractPkh,
          tokenId: "0",
        }}
      />
    );

    expect(screen.getByTestId("deocded-fa-amount")).toHaveTextContent("-3 mockSymbol");
  });

  it("NFT amount renders correctly", () => {
    const mockContractPkh = mockContract(0);

    const mockBalancePlayload: TokenBalancePayload = {
      pkh: "mockPkh",
      tokens: [
        {
          balance: "1",
          account: {
            address: "address",
          },
          token: {
            id: 0,
            contract: { address: mockContractPkh },
            standard: "fa2",
            tokenId: "3",
            metadata: {
              name: "mockNFTName",
              displayUri: "mockDisplayUri",
            },
          },
        },
      ],
    };

    store.dispatch(updateAssets([mockBalancePlayload]));

    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "fa2",
          recipient: mockPkh(0),
          amount: "300",
          sender: "sender",
          contract: mockContractPkh,
          tokenId: "3",
        }}
      />
    );

    expect(screen.getByTestId("deocded-fa-amount")).toHaveTextContent("300 mockNFTName");
  });
});
