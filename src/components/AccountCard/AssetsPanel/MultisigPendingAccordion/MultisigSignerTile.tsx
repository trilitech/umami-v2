import React from "react";
import { ImplicitAccount, MultisigAccount } from "../../../../types/Account";
import { ImplicitAddress } from "../../../../types/Address";
import { useGetImplicitAccountSafe } from "../../../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../../../utils/hooks/assetsHooks";
import { useGetContactName } from "../../../../utils/hooks/contactsHooks";
import { useAsyncActionHandler } from "../../../../utils/hooks/useAsyncActionHandler";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { estimateMultisigApproveOrExecute } from "../../../../utils/tezos";
import { ParamsWithFee } from "../../../ApproveExecuteForm/types";
import { MultisigSignerTileDisplay, MultisigSignerState } from "./MultisigSignerTileDisplay";

const MultisigSignerTile: React.FC<{
  signerAddress: ImplicitAddress;
  pendingApprovals: number;
  operation: MultisigOperation;
  sender: MultisigAccount;
  openSignModal: (params: ParamsWithFee) => void;
}> = ({ pendingApprovals, sender, operation, openSignModal, signerAddress }) => {
  const getContactName = useGetContactName();
  const getImplicitAccount = useGetImplicitAccountSafe();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const network = useSelectedNetwork();

  const implicitAccount = getImplicitAccount(signerAddress.pkh);
  const contactName = getContactName(signerAddress.pkh);

  const accountLabel = implicitAccount?.label;

  const label = accountLabel || contactName;

  const signerAccount = getImplicitAccount(signerAddress.pkh);

  const operationIsExecutable = pendingApprovals === 0;

  const onButtonClick = () =>
    handleAsyncAction(async () => {
      if (!signerAccount) {
        throw new Error("Can't approve or execute with an account you don't own");
      }

      const actionType = operationIsExecutable ? "execute" : "approve";
      const { suggestedFeeMutez } = await estimateMultisigApproveOrExecute(
        {
          type: actionType,
          contract: sender.address,
          operationId: operation.id,
        },
        signerAccount,
        network
      );
      openSignModal({
        type: actionType,
        operation: operation,
        sender,
        signer: signerAccount,
        suggestedFeeMutez,
      });
    });

  return (
    <MultisigSignerTileDisplay
      kind={getKind(signerAccount, contactName)}
      pkh={signerAddress.pkh}
      label={label}
      signerState={getMultisigSignerState({
        approvals: operation.approvals,
        signerAddress,
        operationIsExecutable,
        signerAccount,
      })}
      onClickApproveExecute={onButtonClick}
      isLoading={isLoading}
    />
  );
};

const getKind = (signerAccount?: ImplicitAccount, contactName?: string) => {
  if (contactName) {
    return "contact";
  }

  return signerAccount?.type || "unknown";
};

const getMultisigSignerState = ({
  signerAccount,
  operationIsExecutable,
  approvals,
  signerAddress: signer,
}: {
  signerAccount?: ImplicitAccount;
  operationIsExecutable: boolean;
  approvals: ImplicitAddress[];
  signerAddress: ImplicitAddress;
}): MultisigSignerState => {
  const approvedBySigner = !!approvals.find(approver => approver.pkh === signer.pkh);

  if (!signerAccount) {
    return approvedBySigner ? "approved" : "awaitingApprovalByExternalSigner";
  }

  if (approvedBySigner && !operationIsExecutable) {
    return "approved";
  }

  return operationIsExecutable ? "executable" : "approvable";
};
export default MultisigSignerTile;
