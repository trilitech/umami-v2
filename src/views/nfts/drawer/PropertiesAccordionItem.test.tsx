import { Accordion } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import { mockNFT } from "../../../mocks/factories";
import PropertiesAccordionItem from "./PropertiesAccordionItem";
import { mockPkh } from "../../../mocks/factories";

describe("PropertiesAccordionItem", () => {
  describe("royalties", () => {
    it("shows nothing if royalties are undefined", () => {
      const nft = mockNFT(0);
      delete nft.metadata.royalties;
      render(
        <Accordion>
          <PropertiesAccordionItem nft={nft} style={{}} />
        </Accordion>
      );

      expect(screen.queryByTestId("nft-royalty")).toHaveTextContent(
        "Royalties:"
      );
      expect(screen.queryByTestId("nft-royalty-value")).toHaveTextContent("-");
    });

    it("shows nothing if there are no royalties", () => {
      const nft = mockNFT(0);
      nft.metadata.royalties = {
        decimals: "3",
        shares: {},
      };

      render(
        <Accordion>
          <PropertiesAccordionItem nft={nft} style={{}} />
        </Accordion>
      );
      expect(screen.queryByTestId("nft-royalty")).toHaveTextContent(
        "Royalties:"
      );
      expect(screen.queryByTestId("nft-royalty-value")).toHaveTextContent("-");
    });

    it("shows the number of royalties when more than 1 and total value", () => {
      const nft = mockNFT(0);
      nft.metadata.royalties = {
        decimals: "4",
        shares: {
          [mockPkh(0)]: "1",
          [mockPkh(2)]: "2",
        },
      };

      render(
        <Accordion>
          <PropertiesAccordionItem nft={nft} style={{}} />
        </Accordion>
      );
      expect(screen.queryByTestId("nft-royalty")).toHaveTextContent(
        "Royalties (2):"
      );
      expect(screen.queryByTestId("nft-royalty-value")).toHaveTextContent(
        "0.03%"
      );
    });
  });

  describe("MIME type", () => {
    it("shows nothing when mime type is unavailable", () => {
      const nft = mockNFT(0);
      nft.metadata.formats = [];

      render(
        <Accordion>
          <PropertiesAccordionItem nft={nft} style={{}} />
        </Accordion>
      );
      expect(screen.queryByTestId("nft-mime")).toHaveTextContent("MIME type:");
      expect(screen.queryByTestId("nft-mime-value")).toHaveTextContent("-");
    });

    it("renders when there is an available format", () => {
      const nft = mockNFT(0);
      nft.metadata.formats = [
        {
          uri: nft.displayUri,
          mimeType: "image/png",
        },
      ];

      render(
        <Accordion>
          <PropertiesAccordionItem nft={nft} style={{}} />
        </Accordion>
      );
      expect(screen.queryByTestId("nft-mime")).toHaveTextContent("MIME type:");
      expect(screen.queryByTestId("nft-mime-value")).toHaveTextContent(
        "image/png"
      );
    });
  });
});
