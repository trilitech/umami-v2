import { NFTCard } from "./NFTCard";
import { mockImplicitAddress, mockNFT } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";

describe("NFTCard", () => {
  it("displays the nft image correctly", () => {
    const nft = mockNFT(0);
    const owner = mockImplicitAddress(0).pkh;
    render(<NFTCard nft={{ owner, ...nft }} onClick={() => {}} />);

    expect(screen.getByTestId("nft-image")).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });
});
