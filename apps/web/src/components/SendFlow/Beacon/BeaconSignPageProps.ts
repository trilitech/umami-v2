import { type OperationRequestOutput } from "@airgap/beacon-wallet";
import { type EstimatedAccountOperations } from "@umami/core";

export type BeaconSignPageProps = {
  operation: EstimatedAccountOperations;
  message: OperationRequestOutput;
};
