import { type ResponseMessage } from "./types";

export const sendResponse = (response: ResponseMessage) =>
  window.parent.postMessage(JSON.stringify(response), "*");

export const sendLoginErrorResponse = (errorMessage: string) => {
  sendResponse({
    type: "login_response",
    error: "login_failed",
    errorMessage,
  });
};

export const sendOperationErrorResponse = (errorMessage: string) => {
  sendResponse({
    type: "operation_response",
    error: "operation_failed",
    errorMessage,
  });
};
