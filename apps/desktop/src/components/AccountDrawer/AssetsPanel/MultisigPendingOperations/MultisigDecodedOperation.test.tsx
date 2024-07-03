import {
  type UmamiStore,
  assetsActions,
  makeStore,
  networksActions,
  tokensActions,
} from "@umami/state";
import { MAINNET, mockContractAddress, mockImplicitAddress } from "@umami/tezos";
import { type RawTzktTokenBalance } from "@umami/tzkt";

import { MultisigDecodedOperation } from "./MultisigDecodedOperation";
import { render, screen } from "../../../../mocks/testUtils";

const { updateTokenBalance } = assetsActions;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  store.dispatch(networksActions.setCurrent(MAINNET));
});

describe("<MultisigDecodedOperation />", () => {
  it("displays delegate", () => {
    render(
      <MultisigDecodedOperation
        operation={{
          type: "delegation",
          sender: mockImplicitAddress(0),
          recipient: mockImplicitAddress(1),
        }}
      />,
      { store }
    );

    expect(screen.getByTestId("decoded-item-delegate")).toHaveTextContent("Delegate to");
  });

  it("displays undelegate", () => {
    render(
      <MultisigDecodedOperation
        operation={{
          type: "undelegation",
          sender: mockImplicitAddress(0),
        }}
      />,
      { store }
    );

    expect(screen.getByTestId("decoded-item-undelegate")).toHaveTextContent("End Delegation");
  });

  it("amount renders correctly for tez", () => {
    render(
      <MultisigDecodedOperation
        operation={{ type: "tez", recipient: mockImplicitAddress(0), amount: "1000000" }}
      />,
      { store }
    );

    expect(screen.getByTestId("decoded-tez-amount")).toHaveTextContent("-1.000000 ꜩ");
  });

  it("Non NFT FA tokens amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePayload: RawTzktTokenBalance = {
      account: { address: "mockPkh" },

      balance: "1",
      token: {
        contract: { address: mockContract.pkh },
        standard: "fa2",
        tokenId: "0",
        metadata: {
          decimals: "2",
          symbol: "mockSymbol",
        },
      },
    };
    store.dispatch(updateTokenBalance([mockBalancePayload]));
    store.dispatch(
      tokensActions.addTokens({
        network: MAINNET,
        tokens: [mockBalancePayload.token],
      })
    );

    render(
      <MultisigDecodedOperation
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
      />,
      { store }
    );

    expect(screen.getByTestId("decoded-fa-amount")).toHaveTextContent("-3.00 mockSymbol");
  });

  it("NFT amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePlayload: RawTzktTokenBalance = {
      account: { address: mockImplicitAddress(0).pkh },
      balance: "1",
      token: {
        id: 0,
        contract: { address: mockContract.pkh },
        standard: "fa2",
        tokenId: "3",
        metadata: {
          name: "mockNFTName",
          displayUri: "mockDisplayUri",
        },
      },
    };

    store.dispatch(updateTokenBalance([mockBalancePlayload]));
    store.dispatch(
      tokensActions.addTokens({
        network: MAINNET,
        tokens: [mockBalancePlayload.token],
      }),
      { store }
    );

    render(
      <MultisigDecodedOperation
        operation={{
          type: "fa2",
          recipient: mockImplicitAddress(0),
          amount: "300",
          sender: mockImplicitAddress(0),
          contract: mockContract,
          tokenId: "3",
        }}
      />,
      { store }
    );

    expect(screen.getByTestId("decoded-fa-amount")).toHaveTextContent("300mockNFTName");
  });
});
