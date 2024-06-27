import { mockMultisigAccount } from "@umami/core";
import { getPendingOperations, multisigPendingOpsFixtures } from "@umami/multisig";
import { addTestAccount, store } from "@umami/state";

import { usePollPendingOperations } from "./usePollPendingOperations";
import { renderHook, waitFor } from "../../mocks/testUtils";

jest.mock("@umami/multisig", () => ({
  ...jest.requireActual("@umami/multisig"),
  getPendingOperations: jest.fn(),
}));

describe("usePollPendingOperations", () => {
  it("fetches pending operations and updates the state", async () => {
    jest.mocked(getPendingOperations).mockResolvedValue(multisigPendingOpsFixtures);
    addTestAccount(mockMultisigAccount(0));

    renderHook(() => usePollPendingOperations());

    await waitFor(() => expect(getPendingOperations).toHaveBeenCalledTimes(1));
    const bigMapId = multisigPendingOpsFixtures[0].bigmapId;
    expect(store.getState().multisigs.pendingOperations).toEqual({
      [bigMapId]: multisigPendingOpsFixtures,
    });
  });
});
