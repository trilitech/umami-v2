import { WalletClient } from "@umami/state";

import { AppsMenu } from "./AppsMenu";
import { act, renderInDrawer, screen, userEvent } from "../../../testUtils";

describe("<AppsMenu />", () => {
  it("calls addPeer on button click with the copied text", async () => {
    const user = userEvent.setup();
    const payload =
      "btunoo2sZmmMB6k9Bef8tgYs7PsS6g6DFdUiDzVuwMxv7nGJN71eFCtGxGfq321pFy4eT2ckDWWzTdBhvje7VUzy2ZciQSe9rGMCF6Fpx5MCM3q2CWyUt4nhqSFigPhcUHaLAzAwcSTXbSRn9YZ8QJwwaWzdsNF6UW4PrWeCbABvHArBDpeLRNxJRjMpAVndoCCf9Vbu7YRXF2FcxWxUrcqfj1i3hr34M8zRTtP5QuVqita8MW5A6Ub3tB3bDvykqa8aYFvxbWr47USytTQjVqnnFUdBo8rm3cJyUq39hJwUdbvZEyoGUWnfuhFHYcbyZP86CPef1p7Eh1KUEwVKxLxQwNX84Eg1eBkZowRtNKcqqShMhKT7ZEELyfh1ji7NckRF8RJuwuco4dqBg6msuZjZqta4CsJvQw4A66RbePC8LxwKEb3Nhha8cygtbQVC4Scb7PaLY9qwQJjYL7n";
    jest.spyOn(navigator.clipboard, "readText").mockResolvedValue(payload);
    const mockAddPeer = jest.spyOn(WalletClient, "addPeer");

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
});
