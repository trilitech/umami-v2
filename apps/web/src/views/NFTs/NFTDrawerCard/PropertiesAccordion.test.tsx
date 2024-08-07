import { Accordion } from "@chakra-ui/react";
import { type NFTBalance, mockNFTBalance } from "@umami/core";
import { mockImplicitAddress } from "@umami/tezos";

import { PropertiesAccordion } from "./PropertiesAccordion";
import { render, screen } from "../../../testUtils";

const fixture = (nft: NFTBalance) => (
  <Accordion>
    <PropertiesAccordion nft={nft} />
  </Accordion>
);

describe("<PropertiesAccordion />", () => {
  describe("royalties", () => {
    it("shows nothing if royalties are undefined", () => {
      const nft = mockNFTBalance(0);
      delete nft.metadata.royalties;

      render(fixture(nft));

      const element = screen.getByTestId("nft-royalty");

      expect(element).toHaveTextContent("Royalties");
      expect(element).toHaveTextContent("-");
    });

    it("shows nothing if there are no royalties", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.royalties = {
        decimals: "3",
        shares: {},
      };

      render(fixture(nft));

      const element = screen.getByTestId("nft-royalty");

      expect(element).toHaveTextContent("Royalties");
      expect(element).toHaveTextContent("-");
    });

    it("shows the number of royalties when more than 1 and total value", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.royalties = {
        decimals: "4",
        shares: {
          [mockImplicitAddress(0).pkh]: "1",
          [mockImplicitAddress(2).pkh]: "2",
        },
      };

      render(fixture(nft));

      const element = screen.getByTestId("nft-royalty");

      expect(element).toHaveTextContent("Royalties (2)");
      expect(element).toHaveTextContent("0.03%");
    });
  });

  describe("MIME type", () => {
    it("shows nothing when mime type is unavailable", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.formats = [];

      render(fixture(nft));

      const element = screen.getByTestId("nft-mime");

      expect(element).toHaveTextContent("MIME type");
      expect(element).toHaveTextContent("-");
    });

    it("renders when there is an available format", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.formats = [
        {
          uri: nft.displayUri,
          mimeType: "image/png",
        },
      ];

      render(fixture(nft));

      const element = screen.getByTestId("nft-mime");

      expect(element).toHaveTextContent("MIME type");
      expect(element).toHaveTextContent("image/png");
    });
  });

  describe("creatorElement", () => {
    it("shows nothing if creators field is absent", () => {
      const nft = mockNFTBalance(0);
      delete nft.metadata.creators;

      render(fixture(nft));

      const element = screen.getByTestId("nft-creator");

      expect(element).toHaveTextContent("Creator");
      expect(element).toHaveTextContent("-");
    });

    it("shows nothing if creators field is empty", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.creators = [];

      render(fixture(nft));

      const element = screen.getByTestId("nft-creator");

      expect(element).toHaveTextContent("Creator");
      expect(element).toHaveTextContent("-");
    });

    it("shows the first creator in the list", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.creators = ["Creator123", "Creator321"];

      render(fixture(nft));

      const element = screen.getByTestId("nft-creator");

      expect(element).toHaveTextContent("Creator");
      expect(element).toHaveTextContent("Creator123");
    });

    it("shows creator's address if it's a valid address", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.creators = [mockImplicitAddress(0).pkh];

      render(fixture(nft));

      const element = screen.getByTestId("nft-creator");

      expect(element).toHaveTextContent("Creator");
      expect(element).toHaveTextContent("tz1gU...dWh7h");
    });
  });

  describe("editions", () => {
    it("renders totalSupply", () => {
      const nft = mockNFTBalance(0, { totalSupply: "155555" });

      render(fixture(nft));

      const element = screen.getByTestId("nft-editions");

      expect(element).toHaveTextContent("Editions");
      expect(element).toHaveTextContent("155555");
    });

    it("renders a ? when totalSupply is absent", () => {
      const nft = mockNFTBalance(0, { totalSupply: undefined });
      nft.totalSupply = undefined;
      render(fixture(nft));

      const element = screen.getByTestId("nft-editions");

      expect(element).toHaveTextContent("Editions");
      expect(element).toHaveTextContent("?");
    });
  });

  test("contract", () => {
    const nft = mockNFTBalance(0);

    render(fixture(nft));

    const element = screen.getByTestId("nft-contract");

    expect(element).toHaveTextContent("Contract");
    expect(element).toHaveTextContent("KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG");
  });

  test("metadata", () => {
    const nft = mockNFTBalance(0);

    render(fixture(nft));

    const element = screen.getByTestId("nft-metadata");

    expect(element).toHaveTextContent("Metadata");
    expect(element).toHaveTextContent("TzKT");
    expect(screen.getByTestId("nft-metadata-link")).toHaveAttribute(
      "href",
      "https://tzkt.io/KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG/tokens/mockId0/metadata"
    );
  });
});
