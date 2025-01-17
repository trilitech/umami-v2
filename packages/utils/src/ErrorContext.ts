import { type MichelsonV1ExpressionBase, type TezosGenericOperationError } from "@taquito/rpc";
import { TezosOperationError, type TezosOperationErrorWithMessage } from "@taquito/taquito";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";

import { TezosRpcErrors } from "./TezosRpcErrors";

export type ErrorContext = {
  timestamp: string;
  description: string;
  stacktrace: string;
  technicalDetails: any;
  code: number;
  data?: any;
};

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class WalletConnectError extends CustomError {
  code: WcErrorCode;
  context?: string | number;
  constructor(
    message: string,
    code: WcErrorCode,
    session: SessionTypes.Struct | null,
    context?: string | number
  ) {
    const dappName = session?.peer.metadata.name ?? "unknown";
    super(session ? `Request from ${dappName} is rejected. ${message}` : message);
    this.name = "WalletConnectError";
    this.code = code;
    this.context = context;
  }
}

export enum WcErrorCode {
  // JSON-RPC reserved error codes

  PARSE_ERROR = -32700,
  INVALID_REQUEST = -32600,
  METHOD_NOT_FOUND = -32601,
  INVALID_PARAMS = -32602,
  INTERNAL_ERROR = -32603,

  // Application-specific errors (codes >= 0 for clarity)
  USER_REJECTED = 4001,
  UNSUPPORTED_CHAINS = 4002,
  METHOD_UNSUPPORTED = 4003,
  SESSION_NOT_FOUND = 4004,
  MISSING_ACCOUNT_IN_REQUEST = 4005,
  INTERNAL_SIGNER_IS_MISSING = 4006,
  SIGNER_ADDRESS_NOT_REVEALED = 4007,
  UNKNOWN_CURVE_FOR_PUBLIC_KEY = 4008,
  REJECTED_BY_CHAIN = 4009,
  DELEGATE_UNCHANGED = 4010,
  UNKNOWN_ERROR = 4011,
}

// Converts a known L1 error message to a more user-friendly one
export const getTezErrorMessage = (err: string): string | undefined => {
  // Predefined errors with custom messages
  if (err.includes("subtraction_underflow")) {
    return "Insufficient balance, please make sure you have enough funds.";
  } else if (err.includes("contract.non_existing_contract")) {
    return "Contract does not exist, please check if the correct network is selected.";
  } else if (err.includes("staking_to_delegate_that_refuses_external_staking")) {
    return "The baker you are trying to stake to does not accept external staking.";
  } else if (err.includes("empty_implicit_delegated_contract")) {
    return "Emptying an implicit delegated account is not allowed. End delegation before trying again.";
  } else if (err.includes("delegate.unchanged")) {
    return "The delegate is unchanged. Delegation to this address is already done.";
  } else if (err.includes("contract.manager.unregistered_delegate")) {
    return "The provided delegate address is not registered as a delegate. Verify the delegate address and ensure it is active.";
  } else if (err.includes("michelson_v1.script_rejected")) {
    return "The contract code failed to run. Please check the contract.";
  }

  // Fallback: Search in TezosRpcErrors
  for (const [key, { description }] of Object.entries(TezosRpcErrors)) {
    if (err.includes(key)) {
      return description;
    }
  }
};

const isTezosOperationErrorWithMessage = (
  error: TezosGenericOperationError
): error is TezosOperationErrorWithMessage => "with" in error;

export const getErrorContext = (error: any, silent: boolean = false): ErrorContext => {
  const defaultDescription =
    "Something went wrong. Please try again. Contact support if the issue persists.";
  let description = defaultDescription;
  let technicalDetails: any = undefined;
  let code = WcErrorCode.INTERNAL_ERROR;
  const errorMessage = typeof error === "string" ? error : error.message;

  let stacktrace = "";
  if (typeof error === "object" && "stack" in error) {
    stacktrace = error.stack;
  } else if (typeof error === "string") {
    technicalDetails = error;
  }

  if (error instanceof CustomError) {
    description = errorMessage;
  } else if (error instanceof WalletConnectError) {
    code = error.code;
    description = errorMessage;
    technicalDetails = error.context;
  } else if (error instanceof TezosOperationError) {
    code = WcErrorCode.REJECTED_BY_CHAIN;
    const lastError = error.lastError;
    description =
      "Rejected by chain. " +
      (getTezErrorMessage(lastError.id) ?? "") +
      " Details: " +
      errorMessage;
    if (isTezosOperationErrorWithMessage(lastError)) {
      const failswith: MichelsonV1ExpressionBase = lastError.with;
      technicalDetails = [lastError.id, { with: failswith }];
    } else {
      technicalDetails = [lastError.id];
    }
  } else if (error instanceof Error || Object.prototype.hasOwnProperty.call(error, "message")) {
    description = getTezErrorMessage(errorMessage) ?? defaultDescription;
    technicalDetails = errorMessage;
  }

  if (!silent) {
    console.warn("Request failed", code, description, technicalDetails, error);
  }

  return {
    timestamp: new Date().toISOString(),
    description,
    stacktrace,
    technicalDetails,
    code,
  };
};

export const getWcErrorResponse = (error: any): ErrorResponse => {
  const context = getErrorContext(error);
  const response: ErrorResponse = {
    code: context.code,
    message: context.description,
    data: context.technicalDetails,
  };
  return response;
};
