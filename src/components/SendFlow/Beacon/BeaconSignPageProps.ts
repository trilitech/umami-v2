import { OperationRequestOutput } from "@airgap/beacon-wallet";

import { ImplicitOperations } from "../../../types/AccountOperations";
import { Estimation } from "../../../utils/tezos";

export type BeaconSignPageProps = {
  operation: ImplicitOperations;
  estimation: Estimation;
  message: OperationRequestOutput;
};
