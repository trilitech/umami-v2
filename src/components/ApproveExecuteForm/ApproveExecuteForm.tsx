import React from "react";
import { SuccessStep } from "../sendForm/steps/SuccessStep";
import { useStepHistory } from "../useStepHistory";
import { SubmitApproveOrExecuteForm } from "./SubmitApproveExecute";
import { ParamsWithFee } from "./types";

type Steps = { type: "submit" } | { type: "success"; hash: string };

const ApproveExecuteForm: React.FC<{ params: ParamsWithFee }> = ({ params }) => {
  const history = useStepHistory<Steps>({ type: "submit" });

  if (history.currentStep.type === "submit") {
    return (
      <SubmitApproveOrExecuteForm
        {...params}
        onSuccess={hash => {
          history.goToStep({ type: "success", hash });
        }}
      />
    );
  }

  return <SuccessStep hash={history.currentStep.hash} />;
};

export default ApproveExecuteForm;
