import { OperationRequestOutput } from "@airgap/beacon-wallet";
import { Estimate } from "@taquito/taquito";

import { ImplicitOperations } from "../../../types/AccountOperations";

export type BeaconSignPageProps = {
  operation: ImplicitOperations;
  estimations: Estimate[];
  message: OperationRequestOutput;
};
