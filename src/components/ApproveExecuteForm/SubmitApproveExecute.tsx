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
import { approveOrExecuteMultisigOperation } from "../../utils/tezos";
import { AccountSmallTile } from "../AccountSelector/AccountSmallTile";
import { ApproveOrExecute } from "../../utils/tezos/types";
import { TezosNetwork } from "../../types/TezosNetwork";
import { TezosToolkit } from "@taquito/taquito";
import { useSafeLoading } from "../../utils/hooks/useSafeLoading";

type Props = ParamsWithFee & {
  onSuccess: (hash: string) => void;
  network: TezosNetwork;
};

const TITLE: Record<ApproveOrExecute, string> = {
  approve: "Approve transaction",
  execute: "Execute transaction",
};

export const SubmitApproveOrExecuteForm: React.FC<Props> = ({
  network,
  onSuccess,
  signer,
  sender,
  suggestedFeeMutez,
  operation,
  type: actionType,
}) => {
  const { withLoading } = useSafeLoading();

  const approveOrExecute = (tezosToolkit: TezosToolkit) =>
    withLoading(
      async () => {
        const result = await approveOrExecuteMultisigOperation(
          {
            contract: sender.address,
            operationId: operation.id,
            type: actionType,
          },
          tezosToolkit
        );
        onSuccess(result.hash);
      },
      { title: "Failed propose or execute" }
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
        <SignButton network={network} onSubmit={approveOrExecute} signer={signer} />
      </ModalFooter>
    </ModalContent>
  );
};
