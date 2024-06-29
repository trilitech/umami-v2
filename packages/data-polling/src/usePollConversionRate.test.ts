import { makeStore } from "@umami/state";
import { getTezosPriceInUSD } from "@umami/tzkt";

import { renderHook, waitFor } from "./testUtils";
import { usePollConversionRate } from "./usePollConversionRate";

jest.mock("@umami/tzkt");

describe("usePollConversionRate", () => {
  it("fetches conversion rate and updates the state", async () => {
    const store = makeStore();

    jest.mocked(getTezosPriceInUSD).mockResolvedValue(123);

    renderHook(() => usePollConversionRate(), { store });

    await waitFor(() => expect(getTezosPriceInUSD).toHaveBeenCalledTimes(1));
    expect(store.getState().assets.conversionRate).toEqual(123);
  });
});
