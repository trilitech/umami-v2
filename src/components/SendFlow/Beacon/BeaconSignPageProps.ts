import { OperationRequestOutput } from "@airgap/beacon-wallet";

import { ImplicitOperations } from "../../../types/AccountOperations";
import { ExecuteParams } from "../../../utils/tezos";

export type BeaconSignPageProps = {
  operation: ImplicitOperations;
  executeParams: ExecuteParams;
  message: OperationRequestOutput;
};
