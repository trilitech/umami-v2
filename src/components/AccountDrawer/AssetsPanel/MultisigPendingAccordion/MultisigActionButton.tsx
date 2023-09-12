import { Button } from "@chakra-ui/react";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { RxCheckCircled } from "react-icons/rx";
import colors from "../../../../style/colors";
import { IconAndTextBtn } from "../../../IconAndTextBtn";

export type MultisigSignerState =
  | "awaitingApprovalByExternalSigner"
  | "approved"
  | "executable"
  | "approvable";

export const MultisigActionButton: React.FC<{
  signerState: MultisigSignerState;
  onClickApproveExecute: () => void;
  isLoading?: boolean;
}> = ({ onClickApproveExecute, isLoading = false, signerState }) => {
  switch (signerState) {
    case "awaitingApprovalByExternalSigner": {
      return (
        <IconAndTextBtn
          data-testid="multisig-signer-awaiting-approval"
          icon={CgSandClock}
          iconColor={colors.orange}
          iconHeight={5}
          iconWidth={5}
          label="Awaiting Approval"
        />
      );
    }
    case "approved": {
      return (
        <IconAndTextBtn
          data-testid="multisig-signer-approved"
          icon={RxCheckCircled}
          iconColor={colors.greenL}
          iconHeight={5}
          iconWidth={5}
          label="Approved"
        />
      );
    }
    case "executable": {
      return (
        <Button
          data-testid="multisig-signer-button"
          onClick={onClickApproveExecute}
          isLoading={isLoading}
        >
          Execute
        </Button>
      );
    }

    case "approvable": {
      return (
        <Button
          data-testid="multisig-signer-button"
          onClick={onClickApproveExecute}
          isLoading={isLoading}
        >
          Approve
        </Button>
      );
    }
  }
};

export default MultisigActionButton;
