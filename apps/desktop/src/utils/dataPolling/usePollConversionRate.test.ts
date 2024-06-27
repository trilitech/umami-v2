import { store } from "@umami/state";
import { getTezosPriceInUSD } from "@umami/tzkt";

import { usePollConversionRate } from "./usePollConversionRate";
import { renderHook, waitFor } from "../../mocks/testUtils";

jest.mock("@umami/tzkt");

describe("usePollConversionRate", () => {
  it("fetches conversion rate and updates the state", async () => {
    jest.mocked(getTezosPriceInUSD).mockResolvedValue(123);

    renderHook(() => usePollConversionRate());

    await waitFor(() => expect(getTezosPriceInUSD).toHaveBeenCalledTimes(1));
    expect(store.getState().assets.conversionRate).toEqual(123);
  });
});
