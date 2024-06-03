import { BeaconSignPageProps } from "./BeaconSignPageProps";
import { ContractCallSignPage } from "./ContractCallSignPage";
import { DelegationSignPage } from "./DelegationSignPage";
import { OriginationOperationSignPage } from "./OriginationOperationSignPage";
import { TezSignPage as BeaconTezSignPage } from "./TezSignPage";
import { UndelegationSignPage } from "./UndelegationSignPage";

export const BeaconSignPage: React.FC<BeaconSignPageProps> = ({
  operation,
  executeParams,
  message,
}) => {
  const operationType = operation.operations[0].type;

  switch (operationType) {
    case "tez": {
      return (
        <BeaconTezSignPage
          executeParams={executeParams}
          message={message}
          operation={operation}
        />
      );
    }
    case "contract_call": {
      return (
        <ContractCallSignPage
          executeParams={executeParams}
          message={message}
          operation={operation}
        />
      );
    }
    case "delegation": {
      return (
        <DelegationSignPage
          executeParams={executeParams}
          message={message}
          operation={operation}
        />
      );
    }
    case "undelegation": {
      return (
        <UndelegationSignPage
          executeParams={executeParams}
          message={message}
          operation={operation}
        />
      );
    }
    case "contract_origination":
      return (
        <OriginationOperationSignPage
          executeParams={executeParams}
          message={message}
          operation={operation}
        />
      );
    /**
     * FA1/2 are impossible to get here because we don't parse them
     * instead we get a generic contract call
     * contract_origination is not supported yet
     * check {@link beacon#partialOperationToOperation} for details
     */
    case "fa1.2":
    case "fa2":
      throw new Error("Unsupported operation type");
  }
};
