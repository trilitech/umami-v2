import { PropsWithChildren, useState } from "react";

import { NFTCard } from "./NFTCard";
import { SelectedNFTContext } from "./SelectedNFTContext";
import { mockImplicitAddress, mockNFT } from "../../mocks/factories";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { NFTWithOwner } from "../../utils/token/utils";

const TestWrapper = ({ nft, children }: PropsWithChildren<{ nft?: NFTWithOwner }>) => {
  const [selectedNFT, setSelectedNFT] = useState<NFTWithOwner | undefined>(nft);

  return (
    <SelectedNFTContext.Provider value={{ selectedNFT, setSelectedNFT }}>
      {children}
    </SelectedNFTContext.Provider>
  );
};

describe("NFTCard", () => {
  it("displays the nft image correctly", () => {
    const nft = { ...mockNFT(0), owner: mockImplicitAddress(0).pkh };
    render(<NFTCard nft={nft} />);

    expect(screen.getByTestId("nft-image")).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });

  describe("highlighting", () => {
    it("doesn't highlight the NFT if it's not selected", () => {
      const nft = { ...mockNFT(0), owner: mockImplicitAddress(0).pkh };
      render(
        <TestWrapper>
          <NFTCard nft={nft} />
        </TestWrapper>
      );

      expect(screen.queryByTestId("nft-card-selected")).not.toBeInTheDocument();
      expect(screen.getByTestId("nft-card")).toBeInTheDocument();
    });

    it("doesn't highlight the NFT if its owner doesn't match", () => {
      const nft = { ...mockNFT(0), owner: mockImplicitAddress(0).pkh };
      render(
        <TestWrapper nft={{ ...nft, owner: mockImplicitAddress(1).pkh }}>
          <NFTCard nft={nft} />
        </TestWrapper>
      );

      expect(screen.queryByTestId("nft-card-selected")).not.toBeInTheDocument();
      expect(screen.getByTestId("nft-card")).toBeInTheDocument();
    });

    it("highlights the NFT if it's selected", () => {
      const nft = { ...mockNFT(0), owner: mockImplicitAddress(0).pkh };
      render(
        <TestWrapper nft={nft}>
          <NFTCard nft={nft} />
        </TestWrapper>
      );

      expect(screen.getByTestId("nft-card-selected")).toBeInTheDocument();
      expect(screen.queryByTestId("nft-card")).not.toBeInTheDocument();
    });

    it("highlights the NFT on click", async () => {
      const user = userEvent.setup();
      const nft = { ...mockNFT(0), owner: mockImplicitAddress(0).pkh };

      render(
        <TestWrapper>
          <NFTCard nft={nft} />
        </TestWrapper>
      );

      await act(() => user.click(screen.getByTestId("nft-card")));

      expect(screen.getByTestId("nft-card-selected")).toBeInTheDocument();
      expect(screen.queryByTestId("nft-card")).not.toBeInTheDocument();
    });
  });
});
