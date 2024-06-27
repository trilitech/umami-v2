import { store } from "@umami/state";
import { getLatestBlock } from "@umami/tzkt";

import { usePollBlock } from "./usePollBlock";
import { renderHook, waitFor } from "../../mocks/testUtils";

jest.mock("@umami/tzkt");

describe("usePollBlock", () => {
  it("fetches the latest block and updates the state", async () => {
    jest.mocked(getLatestBlock).mockResolvedValue({ level: 123, cycle: 5 });

    renderHook(() => usePollBlock());

    await waitFor(() => expect(getLatestBlock).toHaveBeenCalled());
    expect(store.getState().assets.block).toEqual({ level: 123, cycle: 5 });
  });
});
