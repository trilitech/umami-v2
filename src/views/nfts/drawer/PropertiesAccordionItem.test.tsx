import { Accordion } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { mockNFT } from "../../../mocks/factories";
import PropertiesAccordionItem from "./PropertiesAccordionItem";
import { mockImplicitAddress } from "../../../mocks/factories";
import { ReduxStore } from "../../../providers/ReduxStore";
import { NFTBalance } from "../../../types/Asset";

const fixture = (nft: NFTBalance) => (
  <ReduxStore>
    <Accordion>
      <PropertiesAccordionItem nft={nft} style={{}} />
    </Accordion>
  </ReduxStore>
);

describe("PropertiesAccordionItem", () => {
  describe("royalties", () => {
    it("shows nothing if royalties are undefined", () => {
      const nft = mockNFT(0);
      delete nft.metadata.royalties;

      render(fixture(nft));
      expect(screen.getByTestId("nft-royalty")).toHaveTextContent("Royalties:");
      expect(screen.getByTestId("nft-royalty-value")).toHaveTextContent("-");
    });

    it("shows nothing if there are no royalties", () => {
      const nft = mockNFT(0);
      nft.metadata.royalties = {
        decimals: "3",
        shares: {},
      };

      render(fixture(nft));
      expect(screen.getByTestId("nft-royalty")).toHaveTextContent("Royalties:");
      expect(screen.getByTestId("nft-royalty-value")).toHaveTextContent("-");
    });

    it("shows the number of royalties when more than 1 and total value", () => {
      const nft = mockNFT(0);
      nft.metadata.royalties = {
        decimals: "4",
        shares: {
          [mockImplicitAddress(0).pkh]: "1",
          [mockImplicitAddress(2).pkh]: "2",
        },
      };

      render(fixture(nft));
      expect(screen.getByTestId("nft-royalty")).toHaveTextContent("Royalties (2):");
      expect(screen.getByTestId("nft-royalty-value")).toHaveTextContent("0.03%");
    });
  });

  describe("MIME type", () => {
    it("shows nothing when mime type is unavailable", () => {
      const nft = mockNFT(0);
      nft.metadata.formats = [];

      render(fixture(nft));
      expect(screen.getByTestId("nft-mime")).toHaveTextContent("MIME type:");
      expect(screen.getByTestId("nft-mime-value")).toHaveTextContent("-");
    });

    it("renders when there is an available format", () => {
      const nft = mockNFT(0);
      nft.metadata.formats = [
        {
          uri: nft.displayUri,
          mimeType: "image/png",
        },
      ];

      render(fixture(nft));
      expect(screen.getByTestId("nft-mime")).toHaveTextContent("MIME type:");
      expect(screen.getByTestId("nft-mime-value")).toHaveTextContent("image/png");
    });
  });

  describe("creatorElement", () => {
    it("shows nothing if creators field is absent", () => {
      const nft = mockNFT(0);
      delete nft.metadata.creators;

      render(fixture(nft));
      // act(() => store.dispatch(assetsActions.updateNetwork(TezosNetwork.MAINNET)));
      expect(screen.getByTestId("nft-creator")).toHaveTextContent("Creator:");
      expect(screen.queryByTestId("nft-creator-value")).toHaveTextContent("-");
    });

    it("shows nothing if creators field is empty", () => {
      const nft = mockNFT(0);
      nft.metadata.creators = [];

      render(fixture(nft));
      expect(screen.getByTestId("nft-creator")).toHaveTextContent("Creator:");
      expect(screen.queryByTestId("nft-creator-value")).toHaveTextContent("-");
    });

    it("shows the first creator in the list", () => {
      const nft = mockNFT(0);
      nft.metadata.creators = ["Creator123", "Creator321"];

      render(fixture(nft));
      expect(screen.getByTestId("nft-creator")).toHaveTextContent("Creator:");
      expect(screen.queryByTestId("nft-creator-value")).toHaveTextContent("Creator123");
    });

    it("shows creator's address if it's a valid address", () => {
      const nft = mockNFT(0);
      nft.metadata.creators = [mockImplicitAddress(0).pkh];

      render(fixture(nft));
      expect(screen.getByTestId("nft-creator")).toHaveTextContent("Creator:");
      expect(screen.queryByTestId("nft-creator-value")).toHaveTextContent("tz1gU...dWh7h");
    });
  });

  describe("editions", () => {
    it("renders totalSupply", () => {
      const nft = mockNFT(0);
      nft.totalSupply = "155555";
      render(fixture(nft));

      expect(screen.getByTestId("nft-editions")).toHaveTextContent("Editions:");
      expect(screen.queryByTestId("nft-editions-value")).toHaveTextContent("155555");
    });

    it("renders a ? when totalSupply is absent", () => {
      const nft = mockNFT(0);
      nft.totalSupply = undefined;
      render(fixture(nft));

      expect(screen.getByTestId("nft-editions")).toHaveTextContent("Editions:");
      expect(screen.queryByTestId("nft-editions-value")).toHaveTextContent("?");
    });
  });
});
