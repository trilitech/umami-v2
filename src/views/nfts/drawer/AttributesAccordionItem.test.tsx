import { Accordion } from "@chakra-ui/react";

import { AttributesAccordionItem } from "./AttributesAccordionItem";
import { mockNFT } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";

describe("AttributesAccordionItem", () => {
  it("shows nothing if there are no attributes", () => {
    const nft = mockNFT(0);
    render(
      <Accordion>
        <AttributesAccordionItem nft={nft} style={{}} />
      </Accordion>
    );

    expect(screen.queryByTestId("attributes-section")).not.toBeInTheDocument();
  });

  it("renders all tags", () => {
    const nft = mockNFT(0);
    nft.metadata.attributes = [
      { name: "attr1", value: "value 1" },
      { name: "attr2", value: "value 2" },
    ];
    render(
      <Accordion>
        <AttributesAccordionItem nft={nft} style={{}} />
      </Accordion>
    );

    const attributeBlocks = screen.getAllByTestId("nft-attribute");
    expect(attributeBlocks).toHaveLength(2);
    expect(attributeBlocks[0]).toHaveTextContent("attr1");
    expect(attributeBlocks[0]).toHaveTextContent("value 1");
    expect(attributeBlocks[1]).toHaveTextContent("attr2");
    expect(attributeBlocks[1]).toHaveTextContent("value 2");
  });
});
