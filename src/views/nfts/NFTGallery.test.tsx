import { render, screen } from "@testing-library/react";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";

import NFTGallery from "./NFTGallery";
import { mockNFTBalance } from "../../mocks/tokens";
import { HashRouter } from "react-router-dom";
import { RawPkh } from "../../types/Address";
import { NFTBalance } from "../../types/TokenBalance";
import { ReduxStore } from "../../providers/ReduxStore";

const fixture = (nftsByOwner: Record<RawPkh, NFTBalance[] | undefined>) => (
  <ReduxStore>
    <HashRouter>
      <NFTGallery nftsByOwner={nftsByOwner} onSelect={() => {}} />
    </HashRouter>
  </ReduxStore>
);

describe("NFTGallery", () => {
  it("sorts the nft by lastLevel in descending order", () => {
    const nft1 = mockNFTBalance(mockContractAddress(1).pkh, "nft1", 1);
    const nft2 = mockNFTBalance(mockContractAddress(2).pkh, "nft2", 2);
    const nft3 = mockNFTBalance(mockContractAddress(3).pkh, "nft3", 3);
    const nft4 = mockNFTBalance(mockContractAddress(4).pkh, "nft4", 4);
    const nftsByOwner = {
      [mockImplicitAddress(1).pkh]: [nft1, nft3],
      [mockImplicitAddress(2).pkh]: [nft2, nft4],
    };
    render(fixture(nftsByOwner));

    const nftNames = screen.getAllByTestId("nft-card-name");
    expect(nftNames[0]).toHaveTextContent("nft4");
    expect(nftNames[1]).toHaveTextContent("nft3");
    expect(nftNames[2]).toHaveTextContent("nft2");
    expect(nftNames[3]).toHaveTextContent("nft1");
  });

  it("sorts last the nft with undefined lastLevel", () => {
    const nft1 = mockNFTBalance(mockContractAddress(1).pkh, "nft1", 1);
    const nft2 = mockNFTBalance(mockContractAddress(2).pkh, "nft2", 2);
    const nft3 = mockNFTBalance(mockContractAddress(3).pkh, "nft3", 3);
    const nft4 = mockNFTBalance(mockContractAddress(4).pkh, "nft4", undefined);
    const nftsByOwner = {
      [mockImplicitAddress(1).pkh]: [nft1, nft3],
      [mockImplicitAddress(2).pkh]: [nft2, nft4],
    };
    render(fixture(nftsByOwner));

    const nftNames = screen.getAllByTestId("nft-card-name");
    expect(nftNames[0]).toHaveTextContent("nft3");
    expect(nftNames[1]).toHaveTextContent("nft2");
    expect(nftNames[2]).toHaveTextContent("nft1");
    expect(nftNames[3]).toHaveTextContent("nft4");
  });

  it("sorts the nft by id in ascending order if last level is the same", () => {
    const nft1 = mockNFTBalance(mockContractAddress(1).pkh, "nft1", 1, 10);
    const nft2 = mockNFTBalance(mockContractAddress(2).pkh, "nft2", 1, 11);
    const nftsByOwner = {
      [mockImplicitAddress(1).pkh]: [nft1],
      [mockImplicitAddress(2).pkh]: [nft2],
    };
    render(fixture(nftsByOwner));

    const nftNames = screen.getAllByTestId("nft-card-name");
    expect(nftNames[0]).toHaveTextContent("nft1");
    expect(nftNames[1]).toHaveTextContent("nft2");
  });
});
