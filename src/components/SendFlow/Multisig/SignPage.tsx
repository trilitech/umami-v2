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
import { ImplicitAccount } from "../../../types/Account";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { DynamicModalContext } from "../../DynamicModal";
import { TezosToolkit } from "@taquito/taquito";
import { AccountOperations } from "../../sendForm/types";
import { executeOperations } from "../../../utils/tezos";
import { SuccessStep } from "../../sendForm/steps/SuccessStep";
import colors from "../../../style/colors";
import SignButton from "../../sendForm/components/SignButton";
import { BigNumber } from "bignumber.js";
import { capitalize } from "lodash";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import { HeaderWrapper } from "../FormPageHeader";

export const SignPage: React.FC<{
  fee: BigNumber;
  operation: AccountOperations;
  actionType: ApproveOrExecute;
  signer: ImplicitAccount;
  // The approve/execute operation size is always 1 (single contract call) so
  // we need to pass the transaction count by decoding the proposed rawActions
  transactionCount: number;
}> = ({ signer, fee, operation, actionType, transactionCount }) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const { opHash } = await executeOperations(operation, tezosToolkit);

        openWith(<SuccessStep hash={opHash} />);
      },
      { title: `Failed ${actionType}` }
    );

  const title = `${capitalize(actionType)} transaction`;

  return (
    <ModalContent>
      <ModalCloseButton />

      <HeaderWrapper>
        <ModalHeader textAlign="center">{title}</ModalHeader>
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
              {transactionCount}
            </Text>
          </Flex>
          <SignPageFee fee={fee} />
        </Flex>
      </ModalBody>

      <ModalFooter>
        <SignButton onSubmit={approveOrExecute} signer={signer} text={title} />
      </ModalFooter>
    </ModalContent>
  );
};

export default SignPage;
