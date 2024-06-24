import { getPendingOperations } from "@umami/multisig";
import { mockMultisigAccount, pendingOps } from "@umami/test-utils";

import { usePollPendingOperations } from "./usePollPendingOperations";
import { addAccount } from "../../mocks/helpers";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("@umami/multisig");

describe("usePollPendingOperations", () => {
  it("fetches pending operations and updates the state", async () => {
    jest.mocked(getPendingOperations).mockResolvedValue(pendingOps);
    addAccount(mockMultisigAccount(0));

    renderHook(() => usePollPendingOperations());

    await waitFor(() => expect(getPendingOperations).toHaveBeenCalledTimes(1));
    const bigMapId = pendingOps[0].bigmapId;
    expect(store.getState().multisigs.pendingOperations).toEqual({ [bigMapId]: pendingOps });
  });
});
