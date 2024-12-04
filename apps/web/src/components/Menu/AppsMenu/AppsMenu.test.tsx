jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  walletKit: {
    core: {},
    metadata: {
      name: "AppMenu test",
      description: "Umami Wallet with WalletConnect",
      url: "https://umamiwallet.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
    getActiveSessions: jest.fn(),
    pair: jest.fn(),
  },
  createWalletKit: jest.fn(),
}));

import { WalletClient, walletKit } from "@umami/state";

import { AppsMenu } from "./AppsMenu";
import { act, renderInDrawer, screen, userEvent } from "../../../testUtils";

describe("<AppsMenu />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("calls addPeer for Beacon on button click with the copied text", async () => {
    const user = userEvent.setup();
    const payload =
      "btunoo2sZmmMB6k9Bef8tgYs7PsS6g6DFdUiDzVuwMxv7nGJN71eFCtGxGfq321pFy4eT2ckDWWzTdBhvje7VUzy2ZciQSe9rGMCF6Fpx5MCM3q2CWyUt4nhqSFigPhcUHaLAzAwcSTXbSRn9YZ8QJwwaWzdsNF6UW4PrWeCbABvHArBDpeLRNxJRjMpAVndoCCf9Vbu7YRXF2FcxWxUrcqfj1i3hr34M8zRTtP5QuVqita8MW5A6Ub3tB3bDvykqa8aYFvxbWr47USytTQjVqnnFUdBo8rm3cJyUq39hJwUdbvZEyoGUWnfuhFHYcbyZP86CPef1p7Eh1KUEwVKxLxQwNX84Eg1eBkZowRtNKcqqShMhKT7ZEELyfh1ji7NckRF8RJuwuco4dqBg6msuZjZqta4CsJvQw4A66RbePC8LxwKEb3Nhha8cygtbQVC4Scb7PaLY9qwQJjYL7n";
    jest.spyOn(navigator.clipboard, "readText").mockResolvedValue(payload);
    jest.spyOn(walletKit, "getActiveSessions").mockImplementation(() => ({}));

    // make sure the mocks are correct
    expect(walletKit.metadata.name).toEqual("AppMenu test");
    expect(walletKit.getActiveSessions()).toEqual({});

    const mockAddPeer = jest.spyOn(WalletClient, "addPeer").mockResolvedValue(undefined);

    await renderInDrawer(<AppsMenu />);

    await act(() => user.click(screen.getByText("Connect")));

    expect(mockAddPeer).toHaveBeenCalledWith({
      icon: "https://assets.objkt.media/file/assets-002/objkt/objkt-logo.png",
      id: "f00f869a-99c5-cd47-b9bc-eb74cb9a84f7",
      name: "objkt.com",
      publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810c",
      relayServer: "beacon-node-1.diamond.papers.tech",
      type: "p2p-pairing-request",
      version: "3",
    });
  });

  it("handles WalletConenct request on button click with the copied text", async () => {
    const user = userEvent.setup();
    const payload =
      "wc:c02d87d6f8c46a9192e1fd4627b5104d326ee6ec4dd9040482a277bdc53e2f10@2?expiryTimestamp=1733241891&relay-protocol=irn&symKey=d8b5f7b8a35b7e73126bfe4af89568811a87c4cfd49e3946c44026d55267ebd7";
    jest.spyOn(navigator.clipboard, "readText").mockResolvedValue(payload);
    jest.spyOn(walletKit, "getActiveSessions").mockImplementation(() => ({}));

    // make sure the mocks are correct
    expect(walletKit.metadata.name).toEqual("AppMenu test");
    expect(walletKit.getActiveSessions()).toEqual({});

    const mockAddPeer = jest.spyOn(WalletClient, "addPeer").mockResolvedValue(undefined);

    await renderInDrawer(<AppsMenu />);

    await act(() => user.click(screen.getByText("Connect")));

    expect(mockAddPeer).not.toHaveBeenCalled();
    expect(walletKit.pair).toHaveBeenCalledWith({ uri: payload });
  });
});
