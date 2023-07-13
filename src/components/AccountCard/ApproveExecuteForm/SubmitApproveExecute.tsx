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
  useToast,
} from "@chakra-ui/react";
import SignButton from "../../sendForm/components/SignButton";
import { ImplicitAccount } from "../../../types/Account";
import { SignerConfig } from "../../../types/SignerConfig";
import { TezosNetwork } from "@airgap/tezos";
import { ParamsWithFee } from "./types";
import { prettyTezAmount } from "../../../utils/format";
import MultisigDecodedOperations from "../AssetsPannel/MultisigPendingAccordion/MultisigDecodedOperations";
import { approveOrExecuteMultisigOperation } from "../../../utils/tezos";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { ApproveOrExecute } from "../../../utils/tezos/types";

type Props = {
  signerAccount: ImplicitAccount;
  onSuccess: (hash: string) => void;
  network: TezosNetwork;
  params: ParamsWithFee;
};

const TITLE: Record<ApproveOrExecute, string> = {
  approve: "Approve transaction",
  execute: "Execute transaction",
};

export const SubmitApproveOrExecuteForm: React.FC<Props> = ({
  network,
  onSuccess,
  signerAccount,
  params,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const approveOrExecute = async (config: SignerConfig) => {
    setIsLoading(true);
    try {
      const result = await approveOrExecuteMultisigOperation(
        {
          contract: params.multisigAddress,
          operationId: params.operation.id,
          type: params.type,
        },
        config
      );
      onSuccess(result.hash);
    } catch (error: any) {
      toast({ title: "Failed propose or execute", description: error.message });
      console.warn("Failed propose or execute", error);
    }
    setIsLoading(false);
  };

  return (
    <ModalContent bg="umami.gray.900">
      <ModalCloseButton />
      <ModalHeader textAlign="center">{TITLE[params.type]}</ModalHeader>
      <ModalBody>
        <Text mt={2} color="text.dark" textAlign="center">
          {TITLE[params.type]}
        </Text>

        <Flex my={4}>
          <Heading size="md" width={20}>
            Signer:
          </Heading>
          <AccountSmallTile pkh={signerAccount.address.pkh} />
        </Flex>
        <MultisigDecodedOperations rawActions={params.operation.rawActions} />

        <Flex aria-label="fee" alignItems="center" justifyContent="space-between">
          <Heading size="sm" color="text.dark">
            Fee
          </Heading>
          <Text size="sm">{prettyTezAmount(String(params.suggestedFeeMutez))}</Text>
        </Flex>
      </ModalBody>

      <ModalFooter justifyContent="center">
        <SignButton
          isLoading={isLoading}
          network={network}
          onSubmit={approveOrExecute}
          signerAccount={signerAccount}
        />
      </ModalFooter>
    </ModalContent>
  );
};
