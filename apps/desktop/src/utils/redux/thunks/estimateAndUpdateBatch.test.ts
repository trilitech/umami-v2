import { mockDelegationOperation, mockImplicitAccount, mockTezOperation } from "@umami/test-utils";
import { DefaultNetworks } from "@umami/tezos";

import { estimateAndUpdateBatch } from "./estimateAndUpdateBatch";
import { executeParams } from "../../../mocks/executeParams";
import { act } from "../../../mocks/testUtils";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { estimate } from "../../tezos/estimate";
import { store } from "../store";

jest.mock("../../tezos/estimate");

describe("estimateAndUpdateBatch", () => {
  describe.each(DefaultNetworks)("on $name", network => {
    it("adds an operation to batch if the estimation succeeds", async () => {
      const operation = mockTezOperation(1);

      jest.mocked(estimate).mockResolvedValueOnce({
        type: "implicit",
        operations: [],
        sender: mockImplicitAccount(0),
        signer: mockImplicitAccount(0),
        estimates: [executeParams()],
      });
      const accountOperations = makeAccountOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        [operation]
      );
      await act(() => store.dispatch(estimateAndUpdateBatch(accountOperations, network)));

      expect(estimate).toHaveBeenCalledWith(accountOperations, network);
      expect(store.getState().batches[network.name]).toEqual([accountOperations]);
    });

    it("doesn't add an operation to batch if the estimation fails", async () => {
      // add one operation to avoid false negatives
      const operation = mockTezOperation(1);
      const accountOperations = makeAccountOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        [operation]
      );

      jest.mocked(estimate).mockResolvedValueOnce({
        ...accountOperations,
        estimates: [executeParams()],
      });

      await act(() => store.dispatch(estimateAndUpdateBatch(accountOperations, network)));

      expect(store.getState().batches[network.name]).toEqual([accountOperations]);

      const failedOperation = mockDelegationOperation(0);
      const failedFormOperations = {
        ...accountOperations,
        operations: [failedOperation],
      };
      const action = estimateAndUpdateBatch(failedFormOperations, network);
      jest.mocked(estimate).mockRejectedValueOnce(new Error("Estimation failed"));

      await expect(() => store.dispatch(action)).rejects.toThrow("Estimation failed");
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(accountOperations, network);
      expect(store.getState().batches[network.name]).toEqual([accountOperations]);
    });
  });
});
