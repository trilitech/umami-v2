import { render, screen } from "@testing-library/react";
import { mockNFT } from "../../../mocks/factories";
import TagsSection from "./TagsSection";

describe("TagsSection", () => {
  it("shows nothing if there are no tags", () => {
    const nft = mockNFT(0);
    render(<TagsSection nft={nft} />);

    expect(screen.queryByTestId("tags-section")).toBeNull();
  });

  it("renders all tags", () => {
    const nft = mockNFT(0);
    nft.metadata.tags = ["tag1", "tag2", "tag3"];
    render(<TagsSection nft={nft} />);

    const tagElements = screen.getAllByTestId("nft-tag");
    expect(tagElements).toHaveLength(3);
    expect(tagElements[0]).toHaveTextContent("tag1");
    expect(tagElements[1]).toHaveTextContent("tag2");
    expect(tagElements[2]).toHaveTextContent("tag3");
  });
});
