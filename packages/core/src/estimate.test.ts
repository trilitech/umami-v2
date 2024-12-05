import { GHOSTNET, isAccountRevealed, makeToolkit } from "@umami/tezos";

import { makeAccountOperations } from "./AccountOperations";
import { estimate, handleTezError } from "./estimate";
import { mockImplicitAccount, mockTezOperation } from "./testUtils";
import { executeParams } from "../../test-utils/src/executeParams";

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
  isAccountRevealed: jest.fn(),
}));

const accountOperations = makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
  mockTezOperation(0),
]);

describe("estimate", () => {
  describe("Error handling", () => {
    it("Catches unrevealed account", async () => {
      jest.mocked(isAccountRevealed).mockResolvedValue(false);

      jest.mocked(makeToolkit).mockImplementation(
        () =>
          ({
            estimate: {
              batch: jest.fn().mockRejectedValue(new Error("Batch estimation failed")),
            },
          }) as any
      );

      await expect(() => estimate(accountOperations, GHOSTNET)).rejects.toThrow(
        "Signer address is not revealed on the ghostnet."
      );
    });

    describe("handleTezError", () => {
      it("catches subtraction_underflow", () => {
        const res = handleTezError(new Error("subtraction_underflow"));
        expect(res).toBe("Insufficient balance, please make sure you have enough funds.");
      });

      it("catches non_existing_contract", () => {
        const res = handleTezError(new Error("contract.non_existing_contract"));
        expect(res).toBe(
          "Contract does not exist, please check if the correct network is selected."
        );
      });

      it("catches staking_to_delegate_that_refuses_external_staking", () => {
        const res = handleTezError(new Error("staking_to_delegate_that_refuses_external_staking"));
        expect(res).toBe("The baker you are trying to stake to does not accept external staking.");
      });

      it("catches empty_implicit_delegated_contract", () => {
        const res = handleTezError(new Error("empty_implicit_delegated_contract"));
        expect(res).toBe("Emptying an implicit delegated account is not allowed.");
      });

      it("returns undefined for unknown errors", () => {
        const err = new Error("unknown error");
        expect(handleTezError(err)).toBeUndefined();
      });
    });
  });

  it("returns estimated operations", async () => {
    const estimateResult = [
      {
        burnFeeMutez: 0,
        consumedMilligas: 168681,
        gasLimit: 169,
        minimalFeeMutez: 269,
        operationFeeMutez: 168.9,
        storageLimit: 0,
        suggestedFeeMutez: 289,
        totalCost: 269,
        usingBaseFeeMutez: 269,
      },
    ];

    const processedEstimateResult = {
      ...accountOperations,
      estimates: [executeParams({ fee: 289, gasLimit: 169 })],
    };

    jest.mocked(makeToolkit).mockImplementation(
      () =>
        ({
          estimate: {
            batch: jest.fn().mockResolvedValue(estimateResult),
          },
        }) as any
    );

    const result = await estimate(accountOperations, GHOSTNET);

    expect(result).toEqual(processedEstimateResult);
  });

  it("can deal with the reveal estimation", async () => {
    const estimateResult = [
      {
        burnFeeMutez: 0,
        consumedMilligas: 1,
        gasLimit: 2,
        minimalFeeMutez: 3,
        operationFeeMutez: 4,
        storageLimit: 5,
        suggestedFeeMutez: 6,
        totalCost: 7,
        usingBaseFeeMutez: 8,
      },
      {
        burnFeeMutez: 0,
        consumedMilligas: 168681,
        gasLimit: 169,
        minimalFeeMutez: 269,
        operationFeeMutez: 168.9,
        storageLimit: 0,
        suggestedFeeMutez: 289,
        totalCost: 269,
        usingBaseFeeMutez: 269,
      },
    ];

    const processedEstimateResult = {
      ...accountOperations,
      estimates: [executeParams({ fee: 289, gasLimit: 169 })],
      revealEstimate: executeParams({ fee: 7, gasLimit: 2, storageLimit: 5 }),
    };

    jest.mocked(makeToolkit).mockImplementation(
      () =>
        ({
          estimate: {
            batch: jest.fn().mockResolvedValue(estimateResult),
          },
        }) as any
    );

    const result = await estimate(accountOperations, GHOSTNET);

    expect(result).toEqual(processedEstimateResult);
  });
});
