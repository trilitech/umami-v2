import { type BeaconSignPageProps } from "./BeaconSignPageProps";
import { ContractCallSignPage } from "./ContractCallSignPage";
import { DelegationSignPage } from "./DelegationSignPage";
import { FinalizeUnstakeSignPage } from "./FinalizeUnstakeSignPage";
import { OriginationOperationSignPage } from "./OriginationOperationSignPage";
import { StakeSignPage } from "./StakeSignPage";
import { TezSignPage as BeaconTezSignPage } from "./TezSignPage";
import { UndelegationSignPage } from "./UndelegationSignPage";
import { UnstakeSignPage } from "./UnstakeSignPage";

export const BeaconSignPage: React.FC<BeaconSignPageProps> = ({ operation, message }) => {
  const operationType = operation.operations[0].type;

  switch (operationType) {
    case "tez": {
      return <BeaconTezSignPage message={message} operation={operation} />;
    }
    case "contract_call": {
      return <ContractCallSignPage message={message} operation={operation} />;
    }
    case "delegation": {
      return <DelegationSignPage message={message} operation={operation} />;
    }
    case "undelegation": {
      return <UndelegationSignPage message={message} operation={operation} />;
    }
    case "contract_origination":
      return <OriginationOperationSignPage message={message} operation={operation} />;
    case "stake":
      return <StakeSignPage message={message} operation={operation} />;
    case "unstake":
      return <UnstakeSignPage message={message} operation={operation} />;
    case "finalize_unstake":
      return <FinalizeUnstakeSignPage message={message} operation={operation} />;
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
