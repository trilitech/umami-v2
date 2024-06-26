export type ErrorContext = {
  timestamp: string;
  description: string;
  stacktrace: string;
};

export const getErrorContext = (error: any): ErrorContext => {
  let description = "Something went wrong";
  if (typeof error === "object" && "message" in error) {
    description = error.message;
  } else if (typeof error === "string") {
    description = error;
  }

  let stacktrace = "";
  if (typeof error === "object" && "stack" in error) {
    stacktrace = error.stack;
  }

  return {
    timestamp: new Date().toISOString(),
    description,
    stacktrace,
  };
};
