import { mockNFT } from "@umami/core";

import { NFTCard } from "./NFTCard";
import { render, screen } from "../../testUtils";

describe("<NFTCard />", () => {
  it("renders the NFT name", () => {
    const nft = mockNFT(0);
    render(<NFTCard nft={nft} />);

    expect(screen.getByTestId("name")).toHaveTextContent(nft.metadata.name!);
  });

  it("renders the NFT image", () => {
    const nft = mockNFT(0);
    render(<NFTCard nft={nft} />);

    const image = screen.getByRole("img");

    expect(image).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });

  describe("nft balance", () => {
    it("is hidden when the balance is 1", () => {
      const nft = mockNFT(0, "1");

      render(<NFTCard nft={nft} />);

      expect(screen.queryByTestId("nft-balance")).not.toBeInTheDocument();
    });

    it("renders the nft balance when it's > 1", () => {
      const nft = mockNFT(0, "10");

      render(<NFTCard nft={nft} />);

      expect(screen.queryByTestId("nft-balance")).toHaveTextContent("10");
    });
  });
});
