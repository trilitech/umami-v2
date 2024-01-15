import { NFTsGrid } from "./NFTsGrid";
import { mockContractAddress, mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { mockNFTBalance } from "../../../mocks/tokens";

describe("<NFTsGrid />", () => {
  const OWNER = mockImplicitAddress(0).pkh;

  describe("with no NFTs", () => {
    it('displays a "No NFTs" message', () => {
      render(<NFTsGrid nfts={[]} owner={OWNER} />);

      expect(screen.getByText("No NFTs found")).toBeInTheDocument();
    });

    it("does not show NFTs", () => {
      render(<NFTsGrid nfts={[]} owner={OWNER} />);

      expect(screen.queryByTestId("nft-link")).not.toBeInTheDocument();
    });

    it("doesn't show a 'View All' link", () => {
      render(<NFTsGrid nfts={[]} owner={OWNER} />);

      expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
    });
  });

  describe("with NFTs", () => {
    it("renders a sorted list of NFTs by last level desc", () => {
      const nfts = [
        mockNFTBalance(mockContractAddress(0).pkh, "some-nft", 1),
        mockNFTBalance(mockContractAddress(1).pkh, "some-nft2", 2),
      ];

      render(<NFTsGrid nfts={nfts} owner={OWNER} />);

      expect(screen.getAllByTestId("nft-link").map(el => el.getAttribute("href"))).toEqual([
        `#/home/${OWNER}/${mockContractAddress(1).pkh}:6`,
        `#/home/${OWNER}/${mockContractAddress(0).pkh}:6`,
      ]);
    });

    it('renders all nfts without "View All" link when <= 18 NFTs', () => {
      const nfts = [];
      for (let i = 0; i < 18; i++) {
        nfts.push(mockNFTBalance(`${i}`, `nft-${i}`, i));
      }

      render(<NFTsGrid nfts={nfts} owner={OWNER} />);

      expect(screen.getAllByTestId("nft-link")).toHaveLength(18);
      expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
    });

    it("renders latest 18 NFTs when there are more", () => {
      const nfts = [];
      for (let i = 0; i < 19; i++) {
        nfts.push(mockNFTBalance(`${i}`, `nft-${i}`, i));
      }

      render(<NFTsGrid nfts={nfts} owner={OWNER} />);

      expect(screen.getAllByTestId("nft-link")).toHaveLength(18);
      expect(screen.getAllByTestId("nft-link").map(el => el.getAttribute("href"))).not.toContain(
        `#/home/${OWNER}/0:6`
      );
    });

    it('renders "View All" link when > 18 NFTs', () => {
      const nfts = [];
      for (let i = 0; i < 19; i++) {
        const label = i > 10 ? `nft-${i}` : `nft-0${i}`;
        nfts.push(mockNFTBalance(`${i}`, label, i));
      }

      render(<NFTsGrid nfts={nfts} owner={OWNER} />);

      expect(screen.getByRole("link", { name: "View All" })).toHaveAttribute(
        "href",
        `#/nfts?accounts=${OWNER}`
      );
    });
  });
});
