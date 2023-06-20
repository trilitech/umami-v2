import { Button } from "@chakra-ui/react";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { RxCheckCircled } from "react-icons/rx";
import colors from "../../../style/colors";
import { ImplicitAddress } from "../../../types/Address";
import { useGetImplicitAccount } from "../../../utils/hooks/accountHooks";
import { IconAndTextBtn } from "../../IconAndTextBtn";

export const MultisigActionButton: React.FC<{
  signer: ImplicitAddress; // TODO: change to ImplicitAccount
  approvers: ImplicitAddress[]; // TODO: change to ImplicitAccount
  pendingApprovals: number;
}> = ({ signer, approvers, pendingApprovals }) => {
  const getImplicitAccount = useGetImplicitAccount();

  const signerInOwnedAccounts = getImplicitAccount(signer.pkh) !== undefined;
  const approvedBySigner = approvers.find(approver => approver === signer) !== undefined;
  const operationIsExecutable = pendingApprovals === 0;

  if (!signerInOwnedAccounts) {
    return (
      <IconAndTextBtn
        data-testid="multisig-signer-approved-or-waiting"
        icon={approvedBySigner ? RxCheckCircled : CgSandClock}
        iconColor={approvedBySigner ? colors.greenL : colors.orange}
        iconHeight={5}
        iconWidth={5}
        label={approvedBySigner ? "Approved" : "Awaiting Approval"}
      />
    );
  } else if (approvedBySigner && !operationIsExecutable) {
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

  return (
    <Button bg={colors.blue} data-testid="multisig-signer-button">
      {operationIsExecutable ? "Execute" : "Approve"}
    </Button>
  );
};

export default MultisigActionButton;
