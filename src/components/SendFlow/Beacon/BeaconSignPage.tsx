import { ImplicitOperations } from "../../sendForm/types";

import BeaconTezSignPage from "./TezSignPage";
import ContractCallSignPage from "./ContractCallSignPage";
import DelegationSignPage from "./DelegationSignPage";
import UndelegationSignPage from "./UndelegationSignPage";

export type BeaconSignPageProps = {
  operation: ImplicitOperations;
  onBeaconSuccess: (hash: string) => Promise<void>;
};

const BeaconSignPage: React.FC<BeaconSignPageProps> = ({ operation, onBeaconSuccess }) => {
  const operationType = operation.operations[0].type;

  switch (operationType) {
    case "tez": {
      return <BeaconTezSignPage operation={operation} onBeaconSuccess={onBeaconSuccess} />;
    }
    case "contract_call": {
      return <ContractCallSignPage operation={operation} onBeaconSuccess={onBeaconSuccess} />;
    }
    case "delegation": {
      return <DelegationSignPage operation={operation} onBeaconSuccess={onBeaconSuccess} />;
    }
    case "undelegation": {
      return <UndelegationSignPage operation={operation} onBeaconSuccess={onBeaconSuccess} />;
    }
    case "fa1.2":
    case "fa2":
    case "contract_origination":
      // this line will not reach, but better safe than sorry
      throw new Error("Unsupported operation type");
  }
};

export default BeaconSignPage;
