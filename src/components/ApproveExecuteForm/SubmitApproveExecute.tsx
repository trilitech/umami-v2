import React from "react";

import {
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Heading,
  Flex,
} from "@chakra-ui/react";
import SignButton from "../sendForm/components/SignButton";
import { ParamsWithFee } from "./types";
import { prettyTezAmount } from "../../utils/format";
import MultisigDecodedOperations from "../AccountCard/AssetsPanel/MultisigPendingAccordion/MultisigDecodedOperations";
import { AccountSmallTile } from "../AccountSelector/AccountSmallTile";
import { ApproveOrExecute } from "../../utils/tezos/types";
import { TezosToolkit } from "@taquito/taquito";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { makeAccountOperations } from "../sendForm/types";
import { makeMultisigApproveOrExecuteOperation } from "../../types/Operation";
import { executeOperations } from "../../utils/tezos";

type Props = ParamsWithFee & {
  onSuccess: (hash: string) => void;
};

const TITLE: Record<ApproveOrExecute, string> = {
  approve: "Approve transaction",
  execute: "Execute transaction",
};

export const SubmitApproveOrExecuteForm: React.FC<Props> = ({
  onSuccess,
  signer,
  sender,
  suggestedFeeMutez,
  operation,
  type: actionType,
}) => {
  const { handleAsyncAction } = useAsyncActionHandler();

  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(
      async () => {
        const executeOrApprove = makeAccountOperations(signer, signer, [
          makeMultisigApproveOrExecuteOperation(sender.address, actionType, operation.id),
        ]);

        const { opHash } = await executeOperations(executeOrApprove, tezosToolkit);

        onSuccess(opHash);
      },
      { title: "Failed approve or execute" }
    );

  return (
    <ModalContent bg="umami.gray.900">
      <ModalCloseButton />
      <ModalHeader textAlign="center">{TITLE[actionType]}</ModalHeader>
      <ModalBody>
        <Text mt={2} color="text.dark" textAlign="center">
          {TITLE[actionType]}
        </Text>

        <Flex my={4}>
          <Heading size="md" width={20}>
            Signer:
          </Heading>
          <AccountSmallTile pkh={signer.address.pkh} />
        </Flex>
        <MultisigDecodedOperations rawActions={operation.rawActions} sender={sender} />

        <Flex aria-label="fee" alignItems="center" justifyContent="space-between">
          <Heading size="sm" color="text.dark">
            Fee
          </Heading>
          <Text size="sm">{prettyTezAmount(String(suggestedFeeMutez))}</Text>
        </Flex>
      </ModalBody>

      <ModalFooter justifyContent="center">
        <SignButton onSubmit={approveOrExecute} signer={signer} />
      </ModalFooter>
    </ModalContent>
  );
};
