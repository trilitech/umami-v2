import { mockContract, mockPkh } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import { FA12Token, FA2Token } from "../../../../types/Asset";
import MultisigDecodedOperationItem, { searchFAToken } from "./MultisigDecodedOperationItem";

describe("<MultisigDecodedOperationItem/>", () => {
  it("displays delegate", () => {
    render(<MultisigDecodedOperationItem operation={{ type: "delegation" }} assets={{}} />);

    expect(screen.getByTestId("decoded-item-delegate")).toHaveTextContent("Undelegate");
  });

  it("amount renders correctly for tez", () => {
    render(
      <MultisigDecodedOperationItem
        operation={{ type: "tez", recipient: mockPkh(0), amount: "1000000" }}
        assets={{}}
      />
    );

    expect(screen.getByTestId("decoded-tez-amount")).toHaveTextContent("-1 ꜩ");
  });

  it("Non NFT FA tokens amount renders correctly", () => {
    const mockContractPkh = mockContract(0);
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
        assets={{
          [mockContractPkh]: [
            {
              type: "fa2",
              contract: mockContractPkh,
              tokenId: "0",
              balance: "0",
              metadata: {
                decimals: "2",
                symbol: "mockSymbol",
              },
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId("deocded-fa-amount")).toHaveTextContent("-3 mockSymbol");
  });

  it("NFT amount renders correctly", () => {
    const mockContractPkh = mockContract(0);
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
        assets={{
          [mockContractPkh]: [
            {
              type: "fa2",
              contract: mockContractPkh,
              tokenId: "0",
              balance: "0",
              metadata: {
                name: "mockNTName",

                displayUri: "mockDisplayUri",
              },
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId("deocded-fa-amount")).toHaveTextContent("300 mockNTName");
  });

  it("searchFAToken finds the token", () => {
    const mockFA2Pkh = mockContract(0);
    const mockFA1Pkh = mockContract(1);

    const mockFA2Token1: FA2Token = {
      type: "fa2",
      contract: mockFA2Pkh,
      tokenId: "0",
      balance: "0",
    };

    const mockFA2Token2: FA2Token = {
      type: "fa2",
      contract: mockFA2Pkh,
      tokenId: "1",
      balance: "0",
    };

    const mockFA1Token: FA12Token = {
      type: "fa1.2",
      contract: mockFA1Pkh,
      balance: "1",
    };

    {
      const res = searchFAToken(
        {
          type: "fa2",
          sender: "sender",
          recipient: "recipient",
          contract: mockFA2Pkh,
          tokenId: "1",
          amount: "0",
        },
        [mockFA1Token, mockFA2Token1, mockFA2Token2]
      );

      expect(res).toEqual(mockFA2Token2);
    }

    {
      const res = searchFAToken(
        {
          type: "fa1.2",
          sender: "sender",
          recipient: "recipient",
          contract: mockFA1Pkh,
          amount: "0",
        },
        [mockFA1Token, mockFA2Token1, mockFA2Token2]
      );

      expect(res).toEqual(mockFA1Token);
    }
  });
});
