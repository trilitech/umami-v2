import { OperationRequestOutput } from "@airgap/beacon-wallet";
import BigNumber from "bignumber.js";

import { ImplicitOperations } from "../../../types/AccountOperations";

export type BeaconSignPageProps = {
  operation: ImplicitOperations;
  fee: BigNumber;
  message: OperationRequestOutput;
};
