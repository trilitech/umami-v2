import { type OperationRequestOutput } from "@tezos-x/octez.connect-wallet";
import { type EstimatedAccountOperations } from "@umami/core";

export type BeaconSignPageProps = {
  operation: EstimatedAccountOperations;
  message: OperationRequestOutput;
};
