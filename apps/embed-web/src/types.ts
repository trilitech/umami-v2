// TODO: Replace this file with import from @trilitech-umami/umami-embed
/* eslint-disable import/no-unused-modules */

import { type PartialTezosOperation } from "@airgap/beacon-types";

export type LogsLevel = "none" | "info" | "warn" | "error";

export type Network = "mainnet" | "ghostnet";

export type TypeOfLogin = "google" | "reddit" | "twitter" | "facebook";

export type UserData = {
  pk: string;
  pkh: string;
  userData: {
    typeOfLogin: TypeOfLogin;
    id: string;
  };
};

export type RequestType = "login_request" | "logout_request" | "operation_request";
export type ResponseType =
  | "init_complete"
  | "login_response"
  | "logout_response"
  | "operation_response";

export const getMatchingType = (type: RequestType): ResponseType => {
  switch (type) {
    case "login_request":
      return "login_response";
    case "logout_request":
      return "logout_response";
    case "operation_request":
      return "operation_response";
  }
};

export type FailedResponse = {
  type: ResponseType;
  error: string;
  errorMessage?: string;
};
export type InitResponse = { type: "init_complete" };

export type LoginRequest = { type: "login_request"; network: Network };
export type LoginResponse = { type: "login_response" } & UserData;

export type LogoutRequest = { type: "logout_request" };
export type LogoutResponse = { type: "logout_response" };

export type OperationRequest = {
  type: "operation_request";
  operations: PartialTezosOperation[];
};
export type OperationResponse = {
  type: "operation_response";
} & { opHash: string };

export type RequestMessage = LoginRequest | LogoutRequest | OperationRequest;
export type ResponseMessage =
  | InitResponse
  | LoginResponse
  | LogoutResponse
  | OperationResponse
  | FailedResponse;
