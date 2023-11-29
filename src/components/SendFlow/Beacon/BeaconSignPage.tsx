import { ImplicitOperations } from "../../../types/AccountOperations";

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
      return <BeaconTezSignPage onBeaconSuccess={onBeaconSuccess} operation={operation} />;
    }
    case "contract_call": {
      return <ContractCallSignPage onBeaconSuccess={onBeaconSuccess} operation={operation} />;
    }
    case "delegation": {
      return <DelegationSignPage onBeaconSuccess={onBeaconSuccess} operation={operation} />;
    }
    case "undelegation": {
      return <UndelegationSignPage onBeaconSuccess={onBeaconSuccess} operation={operation} />;
    }
    case "fa1.2":
    case "fa2":
    case "contract_origination":
      throw new Error("Unsupported operation type");
  }
};

export default BeaconSignPage;
