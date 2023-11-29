import { MultisigDecodedOperationItem } from "./MultisigDecodedOperationItem";
import { mockContractAddress, mockImplicitAddress } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import { MAINNET } from "../../../../types/Network";
import { RawTokenBalance } from "../../../../types/TokenBalance";
import { assetsActions } from "../../../../utils/redux/slices/assetsSlice";
import { networksActions } from "../../../../utils/redux/slices/networks";
import { tokensSlice } from "../../../../utils/redux/slices/tokensSlice";
import { store } from "../../../../utils/redux/store";

const { updateTokenBalance } = assetsActions;

beforeEach(() => {
  store.dispatch(networksActions.setCurrent(MAINNET));
});

describe("<MultisigDecodedOperationItem/>", () => {
  it("displays delegate", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "delegation",
          sender: mockImplicitAddress(0),
          recipient: mockImplicitAddress(1),
        }}
      />
    );

    expect(screen.getByTestId("decoded-item-delegate")).toHaveTextContent("Delegate to");
  });

  it("displays undelegate", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "undelegation",
          sender: mockImplicitAddress(0),
        }}
      />
    );

    expect(screen.getByTestId("decoded-item-undelegate")).toHaveTextContent("End Delegation");
  });

  it("amount renders correctly for tez", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{ type: "tez", recipient: mockImplicitAddress(0), amount: "1000000" }}
      />
    );

    expect(screen.getByTestId("decoded-tez-amount")).toHaveTextContent("-1.000000 ꜩ");
  });

  it("Non NFT FA tokens amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePlayload: RawTokenBalance = {
      account: { address: "mockPkh" },

      balance: "1",
      token: {
        contract: { address: mockContract.pkh },
        standard: "fa2",
        tokenId: "0",
        lastLevel: undefined,
        metadata: {
          decimals: "2",
          symbol: "mockSymbol",
        },
      },
    };
    store.dispatch(updateTokenBalance([mockBalancePlayload]));
    store.dispatch(
      tokensSlice.actions.addTokens({
        network: MAINNET,
        tokens: [mockBalancePlayload.token],
      })
    );

    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "fa2",
          recipient: mockImplicitAddress(0),
          amount: "300",
          sender: {
            type: "implicit",
            pkh: "sender",
          },
          contract: {
            type: "contract",
            pkh: mockContract.pkh,
          },
          tokenId: "0",
        }}
      />
    );

    expect(screen.getByTestId("decoded-fa-amount")).toHaveTextContent("-3.00 mockSymbol");
  });

  it("NFT amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePlayload: RawTokenBalance = {
      account: { address: mockImplicitAddress(0).pkh },
      balance: "1",
      token: {
        id: 0,
        contract: { address: mockContract.pkh },
        standard: "fa2",
        tokenId: "3",
        lastLevel: undefined,
        metadata: {
          name: "mockNFTName",
          displayUri: "mockDisplayUri",
        },
      },
    };

    store.dispatch(updateTokenBalance([mockBalancePlayload]));
    store.dispatch(
      tokensSlice.actions.addTokens({
        network: MAINNET,
        tokens: [mockBalancePlayload.token],
      })
    );

    render(
      <MultisigDecodedOperationItem
        operation={{
          type: "fa2",
          recipient: mockImplicitAddress(0),
          amount: "300",
          sender: mockImplicitAddress(0),
          contract: mockContract,
          tokenId: "3",
        }}
      />
    );

    expect(screen.getByTestId("decoded-fa-amount")).toHaveTextContent("300 mockNFTName");
  });
});
