import { waitFor } from "@testing-library/react";
import { makeFormOperations } from "../../../components/sendForm/types";
import {
  mockDelegationOperation,
  mockImplicitAccount,
  mockTezOperation,
} from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { SupportedNetworks } from "../../network";
import { estimate } from "../../tezos";
import store from "../store";
import { estimateAndUpdateBatch } from "./estimateAndUpdateBatch";

describe("estimateAndUpdateBatch", () => {
  describe.each(SupportedNetworks)("on %s", network => {
    it("adds an operation to batch if the estimation succeeds", async () => {
      const operation = mockTezOperation(1);

      mockEstimatedFee(1000);
      const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
        operation,
      ]);
      const action = estimateAndUpdateBatch(formOperations, network);

      store.dispatch(action);
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(formOperations, network);
      await waitFor(() => {
        expect(store.getState().assets.batches).toEqual([formOperations]);
      });
    });

    it("doesn't add an operation to batch if the estimation fails", async () => {
      // add one operation to avoid false negatives
      const operation = mockTezOperation(1);
      mockEstimatedFee(1000);

      const formOperations = makeFormOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
        operation,
      ]);
      store.dispatch(estimateAndUpdateBatch(formOperations, network));

      await waitFor(() => {
        expect(store.getState().assets.batches).toEqual([formOperations]);
      });

      const failedOperation = mockDelegationOperation(0);
      const failedFormOperations = { ...formOperations, content: [failedOperation] };
      const action = estimateAndUpdateBatch(failedFormOperations, network);
      jest.mocked(estimate).mockRejectedValueOnce(new Error("Estimation failed"));

      await expect(() => store.dispatch(action)).rejects.toThrowError("Estimation failed");
      expect(jest.mocked(estimate)).toHaveBeenCalledWith(formOperations, network);
      expect(store.getState().assets.batches).toEqual([formOperations]);
    });
  });
});
