import { TezosNetwork } from "@airgap/tezos";
import {
  Box,
  Divider,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { AccountType } from "../../../types/Account";
import { SignerConfig } from "../../../types/SignerConfig";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useClearBatch } from "../../../utils/hooks/assetsHooks";
import {
  delegate,
  submitBatch,
  transferFA12Token,
  transferFA2Token,
  transferMutez,
} from "../../../utils/tezos";
import { getBatchSubtotalInTez } from "../../../views/batch/batchUtils";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { useRenderAccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import SignButton from "../components/SignButton";
import {
  Fee,
  Subtotal,
  Total,
  TransactionsAmount,
} from "../components/TezAmountRecaps";
import { EstimatedOperation, OperationValue } from "../types";
import { BigNumber } from "bignumber.js";
import { mutezToTez } from "../../../utils/format";

const makeTransfer = async (
  operation: OperationValue | OperationValue[],
  config: SignerConfig
) => {
  if (Array.isArray(operation)) {
    return submitBatch(operation, config).then((res) => {
      return {
        hash: res.opHash,
      };
    });
  }

  switch (operation.type) {
    case "delegation":
      return await delegate(
        operation.value.sender,
        operation.value.recipient,
        config
      );
    case "tez":
      return await transferMutez(
        operation.value.recipient,
        operation.value.amount,
        config,
        operation.value.parameter
      );
    case "token": {
      const token = operation.data;
      if (token.type === "fa1.2") {
        return await transferFA12Token(
          {
            amount: operation.value.amount,
            contract: token.contract,
            recipient: operation.value.recipient,
            sender: operation.value.sender,
          },
          config
        );
      }
      return await transferFA2Token(
        {
          amount: operation.value.amount,
          contract: token.contract,
          recipient: operation.value.recipient,
          sender: operation.value.sender,
          tokenId: token.tokenId,
        },
        config
      );
    }
  }
};

const NonBatchRecap = ({ transfer }: { transfer: OperationValue }) => {
  const isDelegation = transfer.type === "delegation";
  const token = transfer.type === "token" ? transfer.data : undefined;

  const renderAccountTile = useRenderAccountSmallTile();
  const renderBakerTile = useRenderBakerSmallTile();

  return (
    <>
      {transfer.value.recipient && (
        <Flex mb={4}>
          <Heading size="md" width={20}>
            To:
          </Heading>
          {isDelegation
            ? renderBakerTile(transfer.value.recipient)
            : renderAccountTile(transfer.value.recipient)}
        </Flex>
      )}
      {!!token && token.type === "nft" && (
        <Box mb={4}>
          <SendNFTRecapTile nft={token} />
        </Box>
      )}
      {transfer.type === "tez" ? (
        <Subtotal tez={mutezToTez(transfer.value.amount)} />
      ) : null}
    </>
  );
};

const BatchRecap = ({ transfer }: { transfer: OperationValue[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal tez={getBatchSubtotalInTez(transfer)} />
    </>
  );
};

const getSubTotal = (t: OperationValue[] | OperationValue): BigNumber => {
  if (Array.isArray(t)) {
    return getBatchSubtotalInTez(t);
  }

  if (t.type === "tez") {
    return mutezToTez(t.value.amount);
  }

  return new BigNumber(0);
};

export const RecapDisplay: React.FC<{
  network: TezosNetwork;
  recap: EstimatedOperation;
  onSucces: (hash: string) => void;
}> = ({ recap: { fee, operation: transfer }, network, onSucces }) => {
  const renderAccountTile = useRenderAccountSmallTile();
  const getAccount = useGetOwnedAccount();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearBatch = useClearBatch();

  const signerAccount = getAccount(
    (Array.isArray(transfer) ? transfer[0] : transfer).value.sender
  );

  const handleConfigSubmit = async (config: SignerConfig) => {
    setIsLoading(true);
    if (signerAccount.type === AccountType.LEDGER) {
      toast({
        title: "Request sent to Ledger",
        description:
          "Open the Tezos app on your Ledger and accept to sign the request",
      });
    }

    try {
      const result = await makeTransfer(transfer, config);
      if (Array.isArray(transfer)) {
        clearBatch(signerAccount.pkh);
      }
      onSucces(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }

    setIsLoading(false);
  };

  const feeInTez = mutezToTez(fee);
  const total = feeInTez.plus(getSubTotal(transfer));

  return (
    <ModalContent bg="umami.gray.900" data-testid="bar">
      <form>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Recap</ModalHeader>
        <Text textAlign={"center"}>Transaction details</Text>
        <ModalBody mt={4}>
          <Box>
            <Flex mb={4}>
              <Heading size="md" width={20}>
                From:
              </Heading>
              {renderAccountTile(signerAccount.pkh)}
            </Flex>
            {Array.isArray(transfer) ? (
              <BatchRecap transfer={transfer} />
            ) : (
              <NonBatchRecap transfer={transfer} />
            )}
            <Fee mutez={fee} />
          </Box>
          <Divider mb={2} mt={2} />
          <Total tez={total} />
        </ModalBody>
        <ModalFooter justifyContent={"center"}>
          <SignButton
            isLoading={isLoading}
            network={network}
            onSubmit={handleConfigSubmit}
            signerAccount={signerAccount}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
