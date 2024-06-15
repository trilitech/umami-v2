import { NFTDrawerCard } from "./NFTDrawerCard";
import { mockImplicitAddress, mockNFT } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { type NFTBalance } from "../../types/TokenBalance";

const fixture = (nft: NFTBalance, ownerPkh = mockImplicitAddress(0).pkh) => {
  const nftWithOwner = { ...nft, owner: ownerPkh };
  return <NFTDrawerCard nft={nftWithOwner} />;
};

describe("NFTDrawerCard", () => {
  it("renders the image", () => {
    const nft = mockNFT(0);
    render(fixture(nft));

    expect(screen.getByTestId("nft-image")).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });

  describe("name", () => {
    it("doesn't render if name is absent", () => {
      const nft = mockNFT(0);
      delete nft.metadata.name;
      render(fixture(nft));

      expect(screen.queryByTestId("nft-name")).not.toBeInTheDocument();
    });

    it("renders a name when it's present", () => {
      const nft = mockNFT(0);
      render(fixture(nft));

      expect(screen.getByTestId("nft-name")).toHaveTextContent("Tezzardz #0");
    });
  });

  describe("description", () => {
    it("doesn't render if name is absent", () => {
      const nft = mockNFT(0);
      delete nft.metadata.name;
      render(fixture(nft));

      expect(screen.queryByTestId("nft-description")).not.toBeInTheDocument();
    });

    it("renders a name when it's present", () => {
      const nft = mockNFT(0);
      nft.metadata.description = "Some description";
      render(fixture(nft));

      expect(screen.getByTestId("nft-description")).toHaveTextContent("Some description");
    });
  });

  describe("owned counter", () => {
    it("doesn't render if I own only one nft", () => {
      const nft = mockNFT(0);
      nft.balance = "1";
      render(fixture(nft));

      expect(screen.queryByTestId("nft-owned-count")).not.toBeInTheDocument();
    });

    it("renders the number of owned NFT instances", () => {
      const nft = mockNFT(0);
      nft.balance = "123";
      render(fixture(nft));

      expect(screen.getByTestId("nft-owned-count")).toHaveTextContent("x123");
    });
  });
});
