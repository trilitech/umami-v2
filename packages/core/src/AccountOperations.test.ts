import { type Estimation } from "@umami/tezos";

import { makeAccountOperations, totalFee } from "./AccountOperations";
import { mockImplicitAccount, mockMultisigAccount, mockTezOperation } from "./testUtils";

describe("AccountOperations", () => {
  describe("totalFee", () => {
    it("returns 0 for an empty array", () => {
      expect(totalFee([])).toEqual(0);
    });

    it("returns a sum of all estimations", () => {
      const estimations: Estimation[] = [
        { fee: 1, gasLimit: 1, storageLimit: 1 },
        { fee: 2, gasLimit: 2, storageLimit: 2 },
        { fee: 3, gasLimit: 3, storageLimit: 3 },
      ];

      expect(totalFee(estimations)).toEqual(6);
    });
  });

  describe("makeAccountOperations", () => {
    test("multisig", () => {
      const operations = makeAccountOperations(mockMultisigAccount(0), mockImplicitAccount(0), [
        mockTezOperation(0),
      ]);

      expect(operations).toEqual({
        type: "proposal",
        operations: [mockTezOperation(0)],
        sender: mockMultisigAccount(0),
        signer: mockImplicitAccount(0),
      });
    });

    describe("implicit", () => {
      it("throws if sender is different to signer", () => {
        expect(() =>
          makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(1), [
            mockTezOperation(0),
          ])
        ).toThrow("Sender and Signer must be the same");
      });

      it("returns implicit operations", () => {
        const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
          mockTezOperation(0),
        ]);

        expect(operations).toEqual({
          type: "implicit",
          operations: [mockTezOperation(0)],
          sender: mockImplicitAccount(0),
          signer: mockImplicitAccount(0),
        });
      });
    });
  });
});
