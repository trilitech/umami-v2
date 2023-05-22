import { render, screen } from "@testing-library/react";
import { mockNFT } from "../../mocks/factories";
import NFTCard from "./NFTCard";

describe("NFTCard", () => {
  it("displays the nft image correctly", () => {
    const nft = mockNFT(0);
    render(<NFTCard nft={nft} onClick={() => {}} />);

    expect(screen.getByTestId("nft-image")).toHaveAttribute(
      "src",
      "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG0"
    );
  });
});
