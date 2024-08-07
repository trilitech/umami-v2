import { mockNFTBalance } from "@umami/core";

import { NFTDrawerCard } from "./NFTDrawerCard";
import { FormPage } from "../../../components/SendFlow/NFT/FormPage";
import { act, dynamicDisclosureContextMock, render, screen, userEvent } from "../../../testUtils";

describe("<NFTDrawerCard />", () => {
  describe("image", () => {
    it("renders an image", () => {
      const nft = mockNFTBalance(0);

      render(<NFTDrawerCard nft={nft} />);

      expect(screen.getByTestId("nft-image")).toBeVisible();
      expect(screen.queryByTestId("nft-video")).not.toBeInTheDocument();
    });

    it("renders a video", () => {
      const nft = mockNFTBalance(0);
      nft.metadata.formats = [{ uri: nft.metadata.displayUri, mimeType: "video/mp4" }];

      render(<NFTDrawerCard nft={nft} />);

      expect(screen.getByTestId("nft-video")).toBeVisible();
      expect(screen.queryByTestId("nft-image")).not.toBeInTheDocument();
    });
  });

  describe("amount pill", () => {
    it("is hidden when amount is 1", () => {
      const nft = mockNFTBalance(0);

      render(<NFTDrawerCard nft={nft} />);

      expect(screen.queryByTestId("nft-balance-pill")).not.toBeInTheDocument();
    });

    it("is visible when amount is greater than 1", () => {
      const nft = mockNFTBalance(0, { balance: "2" });

      render(<NFTDrawerCard nft={nft} />);

      expect(screen.getByTestId("nft-balance")).toBeVisible();
    });
  });

  it("renders tags section", () => {
    const nft = mockNFTBalance(0);
    nft.metadata.tags = ["tag1", "tag2"];

    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByTestId("tags-section")).toBeVisible();
  });

  it("renders name", () => {
    const nft = mockNFTBalance(0);
    nft.metadata.name = "Test NFT";
    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByRole("heading", { name: "Test NFT" })).toBeVisible();
  });

  it("renders description", () => {
    const nft = mockNFTBalance(0);
    nft.metadata.description = "Test description";
    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByText("Test description")).toBeVisible();
  });

  it("renders attributes accordion", () => {
    const nft = mockNFTBalance(0);
    nft.metadata.attributes = [{ name: "attr1", value: "value1" }];

    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByTestId("attributes-section")).toBeVisible();
  });

  it("renders properties accordion", () => {
    const nft = mockNFTBalance(0);

    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByTestId("properties-section")).toBeVisible();
  });

  it('renders "Send NFT" button', async () => {
    const user = userEvent.setup();
    const nft = mockNFTBalance(0);

    render(<NFTDrawerCard nft={nft} />);

    const button = screen.getByRole("button", { name: "Send" });

    expect(button).toBeVisible();
    await act(() => user.click(button));

    expect(dynamicDisclosureContextMock.openWith).toHaveBeenCalledWith(<FormPage nft={nft} />);
  });

  it("renders JSON metadata", () => {
    const nft = mockNFTBalance(0);

    render(<NFTDrawerCard nft={nft} />);

    expect(screen.getByTestId("json-section")).toBeVisible();
  });
});
