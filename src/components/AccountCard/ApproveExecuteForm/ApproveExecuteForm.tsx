import React from "react";
import { useGetImplicitAccount } from "../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../utils/hooks/assetsHooks";
import { SuccessStep } from "../../sendForm/steps/SuccessStep";
import { useStepHistory } from "../../useStepHistory";
import { SubmitApproveOrExecuteForm } from "./SubmitApproveExecute";
import { ParamsWithFee } from "./types";

type Steps =
  | {
      type: "submit";
    }
  | { type: "success"; hash: string };

const ApproveExecuteForm: React.FC<{ params: ParamsWithFee }> = ({ params }) => {
  const history = useStepHistory<Steps>({ type: "submit" });
  const getAccount = useGetImplicitAccount();

  const network = useSelectedNetwork();

  if (history.currentStep.type === "submit") {
    const account = getAccount(params.signer.pkh);

    if (!account) {
      throw new Error("Account not found");
    }

    return (
      <SubmitApproveOrExecuteForm
        params={params}
        network={network}
        onSuccess={hash => {
          history.goToStep({ type: "success", hash });
        }}
        signerAccount={account}
      />
    );
  }

  return <SuccessStep hash={history.currentStep.hash} network={network} />;
};

export default ApproveExecuteForm;
