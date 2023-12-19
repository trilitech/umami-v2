import { NFTsGrid } from "./NFTsGrid";
import { mockContractAddress, mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { mockNFTBalance } from "../../../mocks/tokens";

describe("<NFTsGrid />", () => {
  it('displays a "No NFTs" message when there are no NFTs', () => {
    render(<NFTsGrid nfts={[]} owner={mockImplicitAddress(0).pkh} />);

    expect(screen.getByText("No NFTs found")).toBeInTheDocument();
    expect(screen.queryByTestId("nft-link")).not.toBeInTheDocument();
  });

  it("doesn't show a 'View All' link when there are no NFTs", () => {
    render(<NFTsGrid nfts={[]} owner={mockImplicitAddress(0).pkh} />);

    expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
  });

  it("renders a sorted list of NFTs by last level desc", () => {
    const nfts = [
      mockNFTBalance(mockContractAddress(0).pkh, "some-nft", 1),
      mockNFTBalance(mockContractAddress(1).pkh, "some-nft2", 2),
    ];

    render(<NFTsGrid nfts={nfts} owner={mockImplicitAddress(0).pkh} />);
    expect(screen.getAllByTestId("nft-link").map(el => el.getAttribute("href"))).toEqual([
      `#/home/${mockImplicitAddress(0).pkh}/${mockContractAddress(1).pkh}:6`,
      `#/home/${mockImplicitAddress(0).pkh}/${mockContractAddress(0).pkh}:6`,
    ]);
  });

  it('renders a "View All" link', () => {
    const nfts = [mockNFTBalance(mockContractAddress(0).pkh, "some-nft", 2)];

    render(<NFTsGrid nfts={nfts} owner={mockImplicitAddress(0).pkh} />);

    expect(screen.getByRole("link", { name: "View All" })).toHaveAttribute(
      "href",
      `#/nfts?accounts=${mockImplicitAddress(0).pkh}`
    );
  });
});
