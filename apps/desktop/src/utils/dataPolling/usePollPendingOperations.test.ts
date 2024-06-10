import { usePollPendingOperations } from "./usePollPendingOperations";
import { mockMultisigAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { pendingOps } from "../../mocks/multisig";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { getPendingOperationsForMultisigs } from "../multisig/helpers";
import { store } from "../redux/store";

jest.mock("../multisig/helpers");

describe("usePollPendingOperations", () => {
  it("fetches pending operations and updates the state", async () => {
    jest.mocked(getPendingOperationsForMultisigs).mockResolvedValue(pendingOps);
    addAccount(mockMultisigAccount(0));

    renderHook(() => usePollPendingOperations());

    await waitFor(() => expect(getPendingOperationsForMultisigs).toHaveBeenCalledTimes(1));
    const bigMapId = pendingOps[0].bigmapId;
    expect(store.getState().multisigs.pendingOperations).toEqual({ [bigMapId]: pendingOps });
  });
});
