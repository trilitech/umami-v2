import { TokenBalance } from "@tzkt/sdk-api";
import { mockContractAddress, mockImplicitAddress } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import { assetsActions } from "../../../../utils/store/assetsSlice";
import { store } from "../../../../utils/store/store";
import MultisigDecodedOperationItem from "./MultisigDecodedOperationItem";

const { updateTokenBalance } = assetsActions;

describe("<MultisigDecodedOperationItem/>", () => {
  it("displays delegate", () => {
    render(
      <MultisigDecodedOperationItem operation={{ type: "delegation", recipient: undefined }} />
    );

    expect(screen.getByTestId("decoded-item-delegate")).toHaveTextContent("Undelegate");
  });

  it("amount renders correctly for tez", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{ type: "tez", recipient: mockImplicitAddress(0), amount: "1000000" }}
      />
    );

    expect(screen.getByTestId("decoded-tez-amount")).toHaveTextContent("-1 ꜩ");
  });

  it("Non NFT FA tokens amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePlayload: TokenBalance = {
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
    store.dispatch(updateTokenBalance([mockBalancePlayload]));

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

    expect(screen.getByTestId("decoded-fa-amount")).toHaveTextContent("-3 mockSymbol");
  });

  it("NFT amount renders correctly", () => {
    const mockContract = mockContractAddress(0);

    const mockBalancePlayload: TokenBalance = {
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
