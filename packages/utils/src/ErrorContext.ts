import { type MichelsonV1ExpressionBase, type TezosGenericOperationError } from "@taquito/rpc";
import { TezosOperationError, type TezosOperationErrorWithMessage } from "@taquito/taquito";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";

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
  wcError: WcErrorKey;
  context?: string | number;
  constructor(
    message: string,
    wcError: WcErrorKey,
    session: SessionTypes.Struct | null,
    context?: string | number
  ) {
    const dappName = session?.peer.metadata.name ?? "unknown";
    super(session ? `Request from ${dappName} is rejected. ${message}` : message);
    this.name = "WalletConnectError";
    this.wcError = wcError;
    this.context = context;
  }
}

export type WcErrorKey = keyof typeof WC_ERRORS;
export const WC_ERRORS = {
  // JSON-RPC reserved error codes
  PARSE_ERROR: { code: -32700, message: "Invalid JSON received by the server." },
  INVALID_REQUEST: { code: -32600, message: "The JSON sent is not a valid request object." },
  METHOD_NOT_FOUND: { code: -32601, message: "The method does not exist or is not available." },
  INVALID_PARAMS: { code: -32602, message: "Invalid method parameters." },
  INTERNAL_ERROR: { code: -32603, message: "Internal JSON-RPC error." },

  // Application-specific errors (codes >= 0 for clarity)
  USER_REJECTED: { code: 4001, message: "User rejected the request." },
  UNSUPPORTED_CHAINS: { code: 4002, message: "Unsupported chains." },
  METHOD_UNSUPPORTED: { code: 4003, message: "Method unsupported." },
  SESSION_NOT_FOUND: { code: 4004, message: "Session not found." },
  MISSING_ACCOUNT_IN_REQUEST: { code: 4005, message: "Missing account in request." },
  INTERNAL_SIGNER_IS_MISSING: { code: 4006, message: "Internal signer is missing." },
  SIGNER_ADDRESS_NOT_REVEALED: {
    code: 4007,
    message:
      "Signer address is not revealed on the chain. To reveal it, send any amount, e.g., 0.000001ꜩ, from that address to yourself. Wait several minutes and try again.",
  },
  UNKNOWN_CURVE_FOR_PUBLIC_KEY: { code: 4008, message: "Unknown curve for the public key." },
  REJECTED_BY_CHAIN: { code: 4009, message: "Request rejected by chain." },
  DELEGATE_UNCHANGED: { code: 4010, message: "The delegate is unchanged." },
  UNKNOWN_ERROR: { code: 4011, message: "Unknown error." },
};

// Converts a known L1 error message to a more user-friendly one
export const explainTezError = (err: string): string | undefined => {
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
};

const isTezosOperationErrorWithMessage = (
  error: TezosGenericOperationError
): error is TezosOperationErrorWithMessage => "with" in error;

export const getErrorContext = (error: any): ErrorContext => {
  const defaultDescription =
    "Something went wrong. Please try again. Contact support if the issue persists.";
  let description = defaultDescription;
  let technicalDetails: any = undefined;
  let code = WC_ERRORS.UNKNOWN_ERROR.code;
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
    const message = WC_ERRORS[error.wcError].message;
    code = WC_ERRORS[error.wcError].code;
    description = message + errorMessage;
    technicalDetails = error.context;
  } else if (error instanceof TezosOperationError) {
    code = WC_ERRORS.REJECTED_BY_CHAIN.code;
    const lastError = error.lastError;
    description =
      "Rejected by chain. " + (explainTezError(lastError.id) ?? "") + " Details: " + errorMessage;
    if (isTezosOperationErrorWithMessage(lastError)) {
      const failswith: MichelsonV1ExpressionBase = lastError.with;
      technicalDetails = [lastError.id, { with: failswith }];
    } else {
      technicalDetails = [lastError.id];
    }
  } else if (error instanceof Error || Object.prototype.hasOwnProperty.call(error, "message")) {
    const explanation = explainTezError(errorMessage);
    if (explanation) {
      description = explanation;
    } else {
      description = `${defaultDescription} Details: ${errorMessage}`;
    }
    technicalDetails = errorMessage;
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
