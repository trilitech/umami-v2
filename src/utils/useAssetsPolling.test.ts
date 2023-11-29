import { delegatesGet } from "@tzkt/sdk-api";

import { networksActions } from "./redux/slices/networks";
import { store } from "./redux/store";
import { useAssetsPolling } from "./useAssetsPolling";
import { mockBaker } from "../mocks/factories";
import { AllTheProviders, renderHook, waitFor } from "../mocks/testUtils";
import { DefaultNetworks } from "../types/Network";

jest.unmock("./tezos");
jest.mock("@tzkt/sdk-api", () => {
  return {
    delegatesGet: jest.fn(),
    blocksGetCount: jest.fn(),
  };
});

describe("useAssetsPolling", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    beforeAll(() => {
      store.dispatch(networksActions.setCurrent(network));
    });

    test("bakers", async () => {
      const baseUrl = network.tzktApiUrl;
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
