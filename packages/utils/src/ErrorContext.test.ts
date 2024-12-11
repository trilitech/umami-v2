import { CustomError, getErrorContext, handleTezError } from "./ErrorContext";

describe("getErrorContext", () => {
  it("should handle error object with message and stack", () => {
    const error = {
      message: "some error message",
      stack: "some stacktrace",
    };

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("some error message");
    expect(context.stacktrace).toBe("some stacktrace");
    expect(context.description).toBe(
      "Something went wrong. Please try again or contact support if the issue persists."
    );
    expect(context.timestamp).toBeDefined();
  });

  it("should handle string errors", () => {
    const error = "string error message";

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("string error message");
    expect(context.stacktrace).toBe("");
    expect(context.description).toBe(
      "Something went wrong. Please try again or contact support if the issue persists."
    );
    expect(context.timestamp).toBeDefined();
  });

  it("should handle Error instances with Tezos-specific errors", () => {
    const error = new Error("subtraction_underflow");

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("subtraction_underflow");
    expect(context.description).toBe(
      "Insufficient balance, please make sure you have enough funds."
    );
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
  });

  it("should handle CustomError instances", () => {
    const error = new CustomError("Custom error message");

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("");
    expect(context.description).toBe("Custom error message");
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
  });
});

describe("handleTezError", () => {
  it("catches subtraction_underflow", () => {
    const res = handleTezError(new Error("subtraction_underflow"));
    expect(res).toBe("Insufficient balance, please make sure you have enough funds.");
  });

  it("catches non_existing_contract", () => {
    const res = handleTezError(new Error("contract.non_existing_contract"));
    expect(res).toBe("Contract does not exist, please check if the correct network is selected.");
  });

  it("catches staking_to_delegate_that_refuses_external_staking", () => {
    const res = handleTezError(new Error("staking_to_delegate_that_refuses_external_staking"));
    expect(res).toBe("The baker you are trying to stake to does not accept external staking.");
  });

  it("catches empty_implicit_delegated_contract", () => {
    const res = handleTezError(new Error("empty_implicit_delegated_contract"));
    expect(res).toBe(
      "Emptying an implicit delegated account is not allowed. End delegation before trying again."
    );
  });

  it("returns undefined for unknown errors", () => {
    const err = new Error("unknown error");
    expect(handleTezError(err)).toBeUndefined();
  });
});
