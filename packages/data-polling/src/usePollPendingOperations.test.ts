import { mockMultisigAccount } from "@umami/core";
import { getPendingOperations, multisigPendingOpsFixtures } from "@umami/multisig";
import { addTestAccount, makeStore } from "@umami/state";

import { renderHook, waitFor } from "./testUtils";
import { usePollPendingOperations } from "./usePollPendingOperations";

jest.mock("@umami/multisig", () => ({
  ...jest.requireActual("@umami/multisig"),
  getPendingOperations: jest.fn(),
}));

describe("usePollPendingOperations", () => {
  it("fetches pending operations and updates the state", async () => {
    const store = makeStore();
    jest.mocked(getPendingOperations).mockResolvedValue(multisigPendingOpsFixtures);
    addTestAccount(store, mockMultisigAccount(0));

    renderHook(() => usePollPendingOperations(), { store });

    await waitFor(() => expect(getPendingOperations).toHaveBeenCalledTimes(1));
    const bigMapId = multisigPendingOpsFixtures[0].bigmapId;
    expect(store.getState().multisigs.pendingOperations).toEqual({
      [bigMapId]: multisigPendingOpsFixtures,
    });
  });
});
