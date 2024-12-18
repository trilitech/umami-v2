import { type SessionTypes } from "@walletconnect/types";
import { type SdkErrorKey } from "@walletconnect/utils";
export type ErrorContext = {
  timestamp: string;
  description: string;
  stacktrace: string;
  technicalDetails: string;
};

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class WalletConnectError extends CustomError {
  sdkError: SdkErrorKey;
  constructor(message: string, sdkError: SdkErrorKey, session: SessionTypes.Struct | null) {
    const dappName = session?.peer.metadata.name ?? "unknown";
    super(session ? `Request from ${dappName} is rejected. ${message}` : message);
    this.name = "WalletConnectError";
    this.sdkError = sdkError;
  }
}

// Converts a known L1 error message to a more user-friendly one
export const handleTezError = (err: Error): string | undefined => {
  if (err.message.includes("subtraction_underflow")) {
    return "Insufficient balance, please make sure you have enough funds.";
  } else if (err.message.includes("contract.non_existing_contract")) {
    return "Contract does not exist, please check if the correct network is selected.";
  } else if (err.message.includes("staking_to_delegate_that_refuses_external_staking")) {
    return "The baker you are trying to stake to does not accept external staking.";
  } else if (err.message.includes("empty_implicit_delegated_contract")) {
    return "Emptying an implicit delegated account is not allowed. End delegation before trying again.";
  } else if (err.message.includes("delegate.unchanged")) {
    return "The delegate is unchanged. Delegation to this address is already done.";
  }
};

export const getErrorContext = (error: any): ErrorContext => {
  let description =
    "Something went wrong. Please try again or contact support if the issue persists.";
  let technicalDetails;

  let stacktrace = "";
  if (typeof error === "object" && "stack" in error) {
    stacktrace = error.stack;
  }

  if (typeof error === "object" && "message" in error) {
    technicalDetails = error.message;
  } else if (typeof error === "string") {
    technicalDetails = error;
  }

  if (error instanceof CustomError) {
    description = error.message;
    technicalDetails = "";
  } else if (error instanceof Error) {
    description = handleTezError(error) ?? description;
  }

  return {
    timestamp: new Date().toISOString(),
    description,
    stacktrace,
    technicalDetails,
  };
};
