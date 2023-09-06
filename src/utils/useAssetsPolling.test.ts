import { AllTheProviders, renderHook, waitFor } from "../mocks/testUtils";
import { useAssetsPolling } from "./useAssetsPolling";
import { tzktUrls } from "./tezos";
import { delegatesGet } from "@tzkt/sdk-api";
import store from "./redux/store";
import { assetsActions } from "./redux/slices/assetsSlice";
import { mockBaker } from "../mocks/factories";
import { DefaultNetworks } from "../types/Network";

jest.unmock("./tezos");
jest.mock("@tzkt/sdk-api", () => {
  return {
    delegatesGet: jest.fn(),
  };
});

describe("useAssetsPolling", () => {
  describe.each(DefaultNetworks)("network: %s", network => {
    beforeAll(() => {
      store.dispatch(assetsActions.updateNetwork(network));
    });

    test("bakers", async () => {
      const baseUrl = tzktUrls[network];
      (delegatesGet as jest.Mock).mockResolvedValue([
        { ...mockBaker(0), alias: mockBaker(0).name },
        { ...mockBaker(1), alias: mockBaker(1).name },
      ]);
      renderHook(() => useAssetsPolling(), { wrapper: AllTheProviders });
      await waitFor(() => {
        expect(jest.mocked(delegatesGet)).toBeCalledWith(
          {
            sort: { desc: "stakingBalance" },
            active: { eq: true },
            limit: 10000,
            select: { fields: ["address,alias,stakingBalance"] },
          },
          { baseUrl }
        );
      });
      expect(store.getState().assets.bakers).toEqual([mockBaker(0), mockBaker(1)]);
    });
  });
});
