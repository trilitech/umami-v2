import { TezosOperationError, type TezosOperationErrorWithMessage } from "@taquito/taquito";

import {
  CustomError,
  WalletConnectError,
  WcErrorCode,
  getErrorContext,
  getHttpErrorMessage,
  getTezErrorMessage,
  getWcErrorResponse,
} from "./ErrorContext";

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
      "Something went wrong. Please try again. Contact support if the issue persists."
    );
    expect(context.timestamp).toBeDefined();
  });

  it("should handle string errors", () => {
    const error = "string error message";

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("string error message");
    expect(context.stacktrace).toBe("");
    expect(context.description).toBe(
      "Something went wrong. Please try again. Contact support if the issue persists."
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

    expect(context.technicalDetails).toBeUndefined();
    expect(context.description).toBe("Custom error message");
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
  });

  it("should handle WalletConnectError instances", () => {
    const error = new WalletConnectError(
      "Custom WC error message",
      WcErrorCode.INTERNAL_ERROR,
      null
    );

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBeUndefined();
    expect(context.description).toBe("Custom WC error message");
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
    expect(context.code).toBe(WcErrorCode.INTERNAL_ERROR);
  });

  it("should handle HttpErrorResponse instances", () => {
    const error = {
      status: 503,
      message:
        "Http error response: (503) <html><head><title>503 Service Temporarily Unavailable</title></head>",
      url: "https://example.com/api",
    };

    const context = getErrorContext(error);
    expect(context.description).toBe(
      "HTTP request failed for https://example.com/api (503) Service Unavailable - The server is temporarily unable to handle the request. Please try again later or contact support."
    );
    expect(context.code).toBe(503);
    expect(context.technicalDetails).toEqual([
      503,
      "Service Unavailable - The server is temporarily unable to handle the request. Please try again later or contact support.",
      "https://example.com/api",
      "Http error response: (503) 503 Service Temporarily Unavailable",
    ]);
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
  });

  it("should recognize well known http error codes", () => {
    expect(getHttpErrorMessage(123)).toEqual(
      "Unknown Error - Status code: 123. Please try again later or contact support."
    );
    for (const status of [400, 401, 403, 404, 405, 408, 409, 410, 500, 501, 502, 503, 504]) {
      expect(getHttpErrorMessage(status)).toBeDefined();
      expect(getHttpErrorMessage(status)).not.toEqual(
        "Unknown Error - Status code: 123. Please try again later or contact support."
      );
    }
  });
});

describe("getTezErrorMessage", () => {
  it("catches subtraction_underflow", () => {
    const res = getTezErrorMessage("subtraction_underflow");
    expect(res).toBe("Insufficient balance, please make sure you have enough funds.");
  });

  it("catches non_existing_contract", () => {
    const res = getTezErrorMessage("contract.non_existing_contract");
    expect(res).toBe("Contract does not exist, please check if the correct network is selected.");
  });

  it("catches staking_to_delegate_that_refuses_external_staking", () => {
    const res = getTezErrorMessage("staking_to_delegate_that_refuses_external_staking");
    expect(res).toBe("The baker you are trying to stake to does not accept external staking.");
  });

  it("catches empty_implicit_delegated_contract", () => {
    const res = getTezErrorMessage("empty_implicit_delegated_contract");
    expect(res).toBe(
      "Emptying an implicit delegated account is not allowed. End delegation before trying again."
    );
  });

  it("catches delegate.unchanged", () => {
    const res = getTezErrorMessage("delegate.unchanged");
    expect(res).toBe("The delegate is unchanged. Delegation to this address is already done.");
  });

  it("catches contract.manager.unregistered_delegate", () => {
    const res = getTezErrorMessage("contract.manager.unregistered_delegate");
    expect(res).toBe(
      "The provided delegate address is not registered as a delegate. Verify the delegate address and ensure it is active."
    );
  });

  it("returns undefined for unknown errors", () => {
    const err = "unknown error";
    expect(getTezErrorMessage(err)).toBeUndefined();
  });

  it("should return default error message for unknown error", () => {
    const error = new Error("Unknown error");
    const context = getErrorContext(error);
    expect(context.description).toBe(
      "Something went wrong. Please try again. Contact support if the issue persists."
    );
  });

  it("should return custom error message for CustomError", () => {
    const error = new CustomError("Custom error message");
    const context = getErrorContext(error);
    expect(context.description).toBe("Custom error message");
  });

  it("should return WalletConnectError message", () => {
    const error = new WalletConnectError("WC error custom text", WcErrorCode.INTERNAL_ERROR, null);
    const context = getErrorContext(error);
    expect(context.description).toBe("WC error custom text");
    expect(context.code).toBe(WcErrorCode.INTERNAL_ERROR);
    expect(context.technicalDetails).toBeUndefined();
  });

  it("should return TezosOperationError message", () => {
    const mockError: TezosOperationErrorWithMessage = {
      kind: "temporary",
      id: "proto.020-PsParisC.michelson_v1.script_rejected",
      with: { string: "Fail entrypoint" }, // Include the `with` field for testing
    };
    const error = new TezosOperationError(
      [mockError],
      "Operation failed due to a rejected script.",
      []
    );
    const context = getErrorContext(error);
    expect(context.description).toContain(
      "Rejected by chain. The contract code failed to run. Please check the contract.\nDetails: Fail entrypoint"
    );
    expect(context.technicalDetails).toEqual([
      "proto.020-PsParisC.michelson_v1.script_rejected",
      { with: { string: "Fail entrypoint" } },
    ]);
  });

  it("should return error response for getWcErrorResponse", () => {
    const error = new Error("Unknown error");
    const response = getWcErrorResponse(error);
    expect(response.message).toBe(
      "Something went wrong. Please try again. Contact support if the issue persists."
    );
    expect(response.code).toBe(WcErrorCode.INTERNAL_ERROR);
    expect(response.data).toBe("Unknown error");
  });
});
