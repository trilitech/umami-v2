import { render, screen } from "@testing-library/react";
import { mockNFT } from "../../mocks/factories";
import NFTDrawerCard from "./NFTDrawerCard";

describe("NFTDrawerCard", () => {
  it("renders the image", () => {
    const nft = mockNFT(0);
    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByTestId("nft-image")).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });

  describe("name", () => {
    it("doesn't render if name is absent", () => {
      const nft = mockNFT(0);
      delete nft.metadata.name;
      render(<NFTDrawerCard nft={nft} />);

      expect(screen.queryByTestId("nft-name")).toBeNull();
    });

    it("renders a name when it's present", () => {
      const nft = mockNFT(0);
      render(<NFTDrawerCard nft={nft} />);

      expect(screen.getByTestId("nft-name")).toHaveTextContent("Tezzardz #0");
    });
  });

  describe("description", () => {
    it("doesn't render if name is absent", () => {
      const nft = mockNFT(0);
      delete nft.metadata.name;
      render(<NFTDrawerCard nft={nft} />);

      expect(screen.queryByTestId("nft-description")).toBeNull();
    });

    it("renders a name when it's present", () => {
      const nft = mockNFT(0);
      nft.metadata.description = "Some description";
      render(<NFTDrawerCard nft={nft} />);

      expect(screen.getByTestId("nft-description")).toHaveTextContent(
        "Some description"
      );
    });
  });
});
