import { OperationRequestOutput } from "@airgap/beacon-wallet";

import { EstimatedAccountOperations } from "../../../types/AccountOperations";

export type BeaconSignPageProps = {
  operation: EstimatedAccountOperations;
  message: OperationRequestOutput;
};
