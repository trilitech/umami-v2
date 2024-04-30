import { delegatesGet } from "@tzkt/sdk-api";

import { networksActions } from "./redux/slices/networks";
import { store } from "./redux/store";
import { useAssetsPolling } from "./useAssetsPolling";
import { mockBaker } from "../mocks/factories";
import { renderHook, waitFor } from "../mocks/testUtils";
import { DefaultNetworks } from "../types/Network";

jest.mock("@tzkt/sdk-api", () => ({
  delegatesGet: jest.fn(),
}));

describe("useAssetsPolling", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    beforeEach(() => store.dispatch(networksActions.setCurrent(network)));

    test("bakers", async () => {
      const baseUrl = network.tzktApiUrl;
      const mockDelegatesGet = jest.mocked(delegatesGet);
      mockDelegatesGet.mockResolvedValue([
        { ...mockBaker(0), alias: mockBaker(0).name },
        { ...mockBaker(1), alias: mockBaker(1).name },
      ] as any);

      renderHook(() => useAssetsPolling());

      await waitFor(() => {
        expect(mockDelegatesGet).toHaveBeenCalledWith(
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
