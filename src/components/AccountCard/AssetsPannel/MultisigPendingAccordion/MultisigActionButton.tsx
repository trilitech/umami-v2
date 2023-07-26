import { Button } from "@chakra-ui/react";
import React from "react";
import { CgSandClock } from "react-icons/cg";
import { RxCheckCircled } from "react-icons/rx";
import colors from "../../../../style/colors";
import { ImplicitAddress } from "../../../../types/Address";
import { useGetImplicitAccount } from "../../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../../utils/hooks/assetsHooks";
import { estimateMultisigApproveOrExecute } from "../../../../utils/tezos";
import { IconAndTextBtn } from "../../../IconAndTextBtn";
import { ParamsWithFee } from "../../../ApproveExecuteForm/types";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { MultisigAccount } from "../../../../types/Account";

export const MultisigActionButton: React.FC<{
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  account: MultisigAccount;
  openSignModal: (params: ParamsWithFee) => void;
}> = ({
  signerAddress,
  account: { address: multisigAddress },
  operation,
  pendingApprovals,
  openSignModal,
}) => {
  const getImplicitAccount = useGetImplicitAccount();
  const network = useSelectedNetwork();
  const signer = getImplicitAccount(signerAddress.pkh);
  const signerInOwnedAccounts = !!signer;

  const approvedBySigner = !!operation.approvals.find(approver => approver === signerAddress);
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
  }

  if (approvedBySigner && !operationIsExecutable) {
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

  const onButtonClick = async () => {
    const actionType = operationIsExecutable ? "execute" : "approve";
    const { suggestedFeeMutez } = await estimateMultisigApproveOrExecute(
      {
        type: actionType,
        contract: multisigAddress,
        operationId: operation.id,
      },
      signer,
      network
    );
    openSignModal({
      type: actionType,
      operation: operation,
      multisigAddress,
      signer,
      suggestedFeeMutez,
    });
  };

  return (
    <Button bg={colors.blue} data-testid="multisig-signer-button" onClick={onButtonClick}>
      {operationIsExecutable ? "Execute" : "Approve"}
    </Button>
  );
};

export default MultisigActionButton;
