import { estimate, handleTezError } from "./estimate";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { makeAccountOperations } from "../../types/AccountOperations";
import { GHOSTNET } from "../../types/Network";

describe("estimate", () => {
  describe("Error handling", () => {
    it("Catches unrevelaed account", async () => {
      const accountOperations = makeAccountOperations(
        mockImplicitAccount(1),
        mockImplicitAccount(1),
        [mockTezOperation(0)]
      );
      await expect(() => estimate(accountOperations, GHOSTNET)).rejects.toThrowError(
        "Signer address is not revealed on the ghostnet."
      );
    });

    it("catches subtraction_underflow", () => {
      const res = handleTezError({ message: "subtraction_underflow" });
      expect(res).toEqual("Insufficient balance, please make sure you have enough funds.");
    });

    it("catches non_existing_contract", () => {
      const res = handleTezError({ message: "contract.non_existing_contract" });
      expect(res).toEqual(
        "Contract does not exist, please check if the correct network is selected."
      );
    });

    it("returns the original error if not known", () => {
      const err = new Error("unknown error");
      expect(handleTezError(err)).toEqual(err);
    });
  });
});
