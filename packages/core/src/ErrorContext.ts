import { handleTezError } from "./estimate";

export type ErrorContext = {
  timestamp: string;
  description: string;
  stacktrace: string;
  technicalDetails: string;
};

export const getErrorContext = (error: any): ErrorContext => {
  let description =
    "Something went wrong. Please try again or contact support if the issue persists.";
  let technicalDetails;

  let stacktrace = "";
  if (typeof error === "object" && "stack" in error) {
    stacktrace = error.stack;
  }

  if (error instanceof Error) {
    description = handleTezError(error) ?? description;
  }

  if (typeof error === "object" && "message" in error) {
    technicalDetails = error.message;
  } else if (typeof error === "string") {
    technicalDetails = error;
  }

  return {
    timestamp: new Date().toISOString(),
    description,
    stacktrace,
    technicalDetails,
  };
};
