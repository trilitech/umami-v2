import { type BeaconErrorType } from "@airgap/beacon-wallet";
import { type MichelsonV1ExpressionBase, type TezosGenericOperationError } from "@taquito/rpc";
import { TezosOperationError, type TezosOperationErrorWithMessage } from "@taquito/taquito";
import { type ErrorResponse } from "@walletconnect/jsonrpc-utils";
import { type SessionTypes } from "@walletconnect/types";
import sanitizeHtml from "sanitize-html";

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

export class BeaconError extends CustomError {
  errorType: BeaconErrorType;
  constructor(message: string, errorType: BeaconErrorType) {
    super(message);
    this.name = "BeaconError";
    this.errorType = errorType;
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
  WALLET_BUSY = 4012,
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

export const getHttpErrorMessage = (status: number): string => {
  const defaultAction = "Please try again later or contact support.";
  const httpErrorDescriptions: { [key: number]: string } = {
    400: "Bad Request - The server could not understand the request. Please check your input and try again.",
    401: "Unauthorized - Authentication is required or has failed. Please log in and try again.",
    403: "Forbidden - You do not have permission to access the requested resource. Contact support if you believe this is an error.",
    404: `Not Found - The requested resource could not be found. ${defaultAction}`,
    405: `Method Not Allowed - The HTTP method is not supported by the resource. ${defaultAction}`,
    408: "Request Timeout - The server timed out waiting for the request. Please check your network connection and try again.",
    409: `Conflict - There is a conflict with the current state of the resource. ${defaultAction}`,
    410: `Gone - The resource is no longer available. It may have been removed or retired. ${defaultAction}`,
    500: `Internal Server Error - An unexpected error occurred on the server. ${defaultAction}`,
    501: "Not Implemented - The server does not support the functionality required to fulfill the request. Contact support for assistance.",
    502: "Bad Gateway - The server received an invalid response from the upstream server. Please try again later.",
    503: `Service Unavailable - The server is temporarily unable to handle the request. ${defaultAction}`,
    504: "Gateway Timeout - The server did not receive a timely response from the upstream server. Check your network and try again.",
  };

  return (
    httpErrorDescriptions[status] ||
    `Unknown Error - Status code: ${status}. Please try again later or contact support.`
  );
};

function stripHtmlTags(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/[\r\n]/g, " ") // replace new lines with spaces
    .replace(/\s+/g, " ") // replace multiple spaces with single space
    .trim();
}

const isTezosOperationErrorWithMessage = (
  error: TezosGenericOperationError
): error is TezosOperationErrorWithMessage => "with" in error;

export const getErrorContext = (error: any, silent: boolean = false): ErrorContext => {
  const defaultDescription =
    "Something went wrong. Please try again. Contact support if the issue persists.";
  let description = defaultDescription;
  let technicalDetails: any = undefined;
  let code: WcErrorCode | number = WcErrorCode.INTERNAL_ERROR;
  const errorMessage = typeof error === "string" ? error : error.message;

  let stacktrace = "";
  if (typeof error === "object" && "stack" in error) {
    stacktrace = error.stack;
  } else if (typeof error === "string") {
    technicalDetails = error;
  }

  if (error instanceof BeaconError) {
    description = errorMessage;
  } else if (error instanceof WalletConnectError) {
    code = error.code;
    description = errorMessage;
    technicalDetails = error.context;
  } else if (error instanceof CustomError) {
    description = errorMessage;
  } else if (error instanceof TezosOperationError) {
    code = WcErrorCode.REJECTED_BY_CHAIN;
    const lastError = error.lastError;
    description =
      "Rejected by chain. " +
      (getTezErrorMessage(lastError.id) ?? "") +
      "\nDetails: " +
      errorMessage;
    if (isTezosOperationErrorWithMessage(lastError)) {
      const failswith: MichelsonV1ExpressionBase = lastError.with;
      technicalDetails = [lastError.id, { with: failswith }];
    } else {
      technicalDetails = [lastError.id];
    }
  } else if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number" &&
    "url" in error &&
    typeof error.url === "string"
  ) {
    // HttpErrorResponse exception has these fields. Since we need the fields only, we can use them directly.
    const httpError = getHttpErrorMessage(error.status);
    const plainMessage = stripHtmlTags(error.message);
    description = `HTTP request failed for ${error.url} (${error.status}) ${httpError}`;
    code = error.status;
    if (code === 500) {
      description = `${description}\nDetails: ${plainMessage}`;
    }
    technicalDetails = [error.status, httpError, error.url, plainMessage];
  } else if (error instanceof Error || Object.prototype.hasOwnProperty.call(error, "message")) {
    description = getTezErrorMessage(errorMessage) ?? defaultDescription;
    technicalDetails = errorMessage;
  }

  if (!silent) {
    console.error("Request failed", code, description, technicalDetails, error);
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
