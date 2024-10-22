import { CustomError } from "@umami/utils";

import { type SdkSignPageProps } from "../utils";
import { ContractCallSignPage } from "./ContractCallSignPage";
import { DelegationSignPage } from "./DelegationSignPage";
import { FinalizeUnstakeSignPage } from "./FinalizeUnstakeSignPage";
import { OriginationOperationSignPage } from "./OriginationOperationSignPage";
import { StakeSignPage } from "./StakeSignPage";
import { TezSignPage } from "./TezSignPage";
import { UndelegationSignPage } from "./UndelegationSignPage";
import { UnstakeSignPage } from "./UnstakeSignPage";
import { useSignWithBeacon } from "../Beacon/useSignWithBeacon";
import { useSignWithWalletConnect } from "../WalletConnect/useSignWithWc";

export const SingleSignPage = (signProps: SdkSignPageProps) => {
  const operationType = signProps.operation.operations[0].type;

  const beaconCalculatedProps = useSignWithBeacon({ ...signProps });
  const walletConnectCalculatedProps = useSignWithWalletConnect({ ...signProps });
  const calculatedProps =
    signProps.requestId.sdkType === "beacon" ? beaconCalculatedProps : walletConnectCalculatedProps;

  switch (operationType) {
    case "tez": {
      return <TezSignPage {...signProps} {...calculatedProps} />;
    }
    case "contract_call": {
      return <ContractCallSignPage {...signProps} {...calculatedProps} />;
    }
    case "delegation": {
      return <DelegationSignPage {...signProps} {...calculatedProps} />;
    }
    case "undelegation": {
      return <UndelegationSignPage {...signProps} {...calculatedProps} />;
    }
    case "contract_origination":
      return <OriginationOperationSignPage {...signProps} {...calculatedProps} />;
    case "stake":
      return <StakeSignPage {...signProps} {...calculatedProps} />;
    case "unstake":
      return <UnstakeSignPage {...signProps} {...calculatedProps} />;
    case "finalize_unstake":
      return <FinalizeUnstakeSignPage {...signProps} {...calculatedProps} />;
    /**
     * FA1/2 are impossible to get here because we don't parse them
     * instead we get a generic contract call
     * contract_origination is not supported yet
     * check {@link beacon#partialOperationToOperation} for details
     */
    case "fa1.2":
    case "fa2":
      throw new CustomError("Unsupported operation type");
  }
};
