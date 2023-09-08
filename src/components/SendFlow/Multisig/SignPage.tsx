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
import SignButton from "../../sendForm/components/SignButton";
import { BigNumber } from "bignumber.js";
import { parseRawMichelson } from "../../../multisig/decode/decodeLambda";
import { capitalize } from "lodash";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import { HeaderWrapper } from "../FormPageHeader";

export const SignPage: React.FC<{
  type: ApproveOrExecute;
  operation: MultisigOperation;
  signer: ImplicitAccount;
  sender: MultisigAccount;
  fee: BigNumber;
}> = ({ signer, sender, fee, operation: multisigOperation, type: actionType }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const operations = parseRawMichelson(multisigOperation.rawActions, sender);
  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const executeOrApprove = makeAccountOperations(signer, signer, [
          makeMultisigApproveOrExecuteOperation(sender.address, actionType, multisigOperation.id),
        ]);

        const { opHash } = await executeOperations(executeOrApprove, tezosToolkit);

        openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  return (
    <ModalContent>
      <ModalCloseButton />

      <HeaderWrapper>
        <ModalHeader textAlign="center">{`${capitalize(actionType)} transaction`}</ModalHeader>
        <Text textAlign="center" size="sm" color={colors.gray[400]}>
          Enter your password to confirm this transaction.
        </Text>
      </HeaderWrapper>

      <ModalBody>
        <AddressTile address={signer.address} />
        <Flex my="12px" px="4px" alignItems="center" justifyContent="space-between">
          <Flex>
            <Text size="sm" mr={1} color={colors.gray[450]}>
              Transactions:
            </Text>
            <Text size="sm" data-testid="transaction-length" color={colors.gray[400]}>
              {operations.length}
            </Text>
          </Flex>
          <SignPageFee fee={fee} />
        </Flex>
      </ModalBody>

      <ModalFooter>
        <SignButton onSubmit={approveOrExecute} signer={signer} />
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPage;
