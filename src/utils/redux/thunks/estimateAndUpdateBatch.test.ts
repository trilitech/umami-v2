import { waitFor } from "@testing-library/react";
import { makeAccountOperations } from "../../../components/sendForm/types";
import {
  mockDelegationOperation,
  mockImplicitAccount,
  mockTezOperation,
} from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { estimate } from "../../tezos";
import store from "../store";
import { estimateAndUpdateBatch } from "./estimateAndUpdateBatch";
import { DefaultNetworks } from "../../../types/Network";

describe("estimateAndUpdateBatch", () => {
  describe.each(DefaultNetworks)("on %s", network => {
    it("adds an operation to batch if the estimation succeeds", async () => {
      const operation = mockTezOperation(1);

      mockEstimatedFee(1000);
      const accountOperations = makeAccountOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        [operation]
      );
      const action = estimateAndUpdateBatch(accountOperations, network);

      store.dispatch(action);
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(accountOperations, network);
      await waitFor(() => {
        expect(store.getState().assets.batches).toEqual([accountOperations]);
      });
    });

    it("doesn't add an operation to batch if the estimation fails", async () => {
      // add one operation to avoid false negatives
      const operation = mockTezOperation(1);
      mockEstimatedFee(1000);

      const accountOperations = makeAccountOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        [operation]
      );
      store.dispatch(estimateAndUpdateBatch(accountOperations, network));

      await waitFor(() => {
        expect(store.getState().assets.batches).toEqual([accountOperations]);
      });

      const failedOperation = mockDelegationOperation(0);
      const failedFormOperations = { ...accountOperations, operations: [failedOperation] };
      const action = estimateAndUpdateBatch(failedFormOperations, network);
      jest.mocked(estimate).mockRejectedValueOnce(new Error("Estimation failed"));

      await expect(() => store.dispatch(action)).rejects.toThrowError("Estimation failed");
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(accountOperations, network);
      expect(store.getState().assets.batches).toEqual([accountOperations]);
    });
  });
});
