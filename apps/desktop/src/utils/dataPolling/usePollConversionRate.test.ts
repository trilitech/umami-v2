import { usePollConversionRate } from "./usePollConversionRate";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getTezosPriceInUSD } from "../tezos";

jest.mock("../tezos");

describe("usePollConversionRate", () => {
  it("fetches conversion rate and updates the state", async () => {
    jest.mocked(getTezosPriceInUSD).mockResolvedValue(123);

    renderHook(() => usePollConversionRate());

    await waitFor(() => expect(getTezosPriceInUSD).toHaveBeenCalledTimes(1));
    expect(store.getState().assets.conversionRate).toEqual(123);
  });
});
