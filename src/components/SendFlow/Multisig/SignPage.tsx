import React, { useContext } from "react";

import {
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Flex,
} from "@chakra-ui/react";
import { ApproveOrExecute } from "../../../utils/tezos/types";
import { MultisigOperation } from "../../../utils/multisig/types";
import { ImplicitAccount, MultisigAccount } from "../../../types/Account";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { DynamicModalContext } from "../../DynamicModal";
import { TezosToolkit } from "@taquito/taquito";
import { makeMultisigApproveOrExecuteOperation } from "../../../types/Operation";
import { makeAccountOperations } from "../../sendForm/types";
import { executeOperations } from "../../../utils/tezos";
import { SuccessStep } from "../../sendForm/steps/SuccessStep";
import colors from "../../../style/colors";
import { prettyTezAmount } from "../../../utils/format";
import MultisigDecodedOperations from "../../AccountCard/AssetsPanel/MultisigPendingAccordion/MultisigDecodedOperations";
import SignButton from "../../sendForm/components/SignButton";
import { BigNumber } from "bignumber.js";

export const SignPage: React.FC<{
  type: ApproveOrExecute;
  operation: MultisigOperation;
  signer: ImplicitAccount;
  sender: MultisigAccount;
  fee: BigNumber;
}> = ({ signer, sender, fee, operation, type: actionType }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const executeOrApprove = makeAccountOperations(signer, signer, [
          makeMultisigApproveOrExecuteOperation(sender.address, actionType, operation.id),
        ]);

        const { opHash } = await executeOperations(executeOrApprove, tezosToolkit);

        openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  return (
    <ModalContent bg={colors.gray[900]} p="20px">
      <ModalCloseButton />
      <ModalHeader textAlign="center">{`${
        actionType[0].toUpperCase() + actionType.slice(1)
      } transaction`}</ModalHeader>
      <ModalBody>
        {/* TODO: Use account small tile*/}
        <Flex my={3} alignItems="center" justifyContent="end" px={1}>
          <Flex>
            <Text size="sm" mr={1} color={colors.gray[450]}>
              Fee:
            </Text>
            <Text size="sm" data-testid="fee" color={colors.gray[400]}>
              {prettyTezAmount(`${fee}`)}
            </Text>
          </Flex>
        </Flex>

        <MultisigDecodedOperations rawActions={operation.rawActions} sender={sender} />
      </ModalBody>

      <ModalFooter justifyContent="center">
        <SignButton onSubmit={approveOrExecute} signer={signer} />
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPage;
