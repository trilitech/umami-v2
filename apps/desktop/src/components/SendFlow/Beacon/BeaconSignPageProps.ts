import { type OperationRequestOutput } from "@airgap/beacon-wallet";

import { type EstimatedAccountOperations } from "../../../types/AccountOperations";

export type BeaconSignPageProps = {
  operation: EstimatedAccountOperations;
  message: OperationRequestOutput;
};
