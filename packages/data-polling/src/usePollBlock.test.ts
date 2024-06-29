import { makeStore } from "@umami/state";
import { getLatestBlock } from "@umami/tzkt";

import { renderHook, waitFor } from "./testUtils";
import { usePollBlock } from "./usePollBlock";

jest.mock("@umami/tzkt");

describe("usePollBlock", () => {
  it("fetches the latest block and updates the state", async () => {
    const store = makeStore();
    jest.mocked(getLatestBlock).mockResolvedValue({ level: 123, cycle: 5 });

    renderHook(() => usePollBlock(), { store });

    await waitFor(() => expect(getLatestBlock).toHaveBeenCalled());
    expect(store.getState().assets.block).toEqual({ level: 123, cycle: 5 });
  });
});
