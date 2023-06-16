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
import BigNumber from "bignumber.js";
import { useState } from "react";
import { AccountType } from "../../../types/Account";
import { SignerConfig } from "../../../types/SignerConfig";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useClearBatch } from "../../../utils/hooks/assetsHooks";
import { submitBatch } from "../../../utils/tezos";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import SignButton from "../components/SignButton";
import { Fee, Subtotal, Total } from "../components/TezAmountRecaps";
import { EstimatedOperation, OperationValue } from "../types";
import { BatchRecap } from "./BatchRecap";

const NonBatchRecap = ({ transfer }: { transfer: OperationValue }) => {
  const isDelegation = transfer.type === "delegation";
  const token = transfer.type === "token" ? transfer.data : undefined;

  const renderBakerTile = useRenderBakerSmallTile();

  return (
    <>
      {transfer.value.recipient && (
        <Flex mb={4}>
          <Heading size="md" width={20}>
            To:
          </Heading>
          {isDelegation ? (
            renderBakerTile(transfer.value.recipient)
          ) : (
            <AccountSmallTile pkh={transfer.value.recipient} />
          )}
        </Flex>
      )}
      {token?.type === "nft" && (
        <Box mb={4}>
          <SendNFTRecapTile nft={token} />
        </Box>
      )}
      {transfer.type === "tez" ? <Subtotal mutez={transfer.value.amount} /> : null}
    </>
  );
};

export const RecapDisplay: React.FC<{
  network: TezosNetwork;
  recap: EstimatedOperation;
  onSuccess: (hash: string) => void;
  isBatch: boolean;
}> = ({ recap: { fee, operations }, network, onSuccess: onSucces, isBatch }) => {
  const feeNum = new BigNumber(fee);
  const getAccount = useGetOwnedAccount();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearBatch = useClearBatch();
  const transfer = operations.content;

  const signerAccount = getAccount(transfer[0].value.sender);

  const handleConfigSubmit = async (config: SignerConfig) => {
    setIsLoading(true);
    if (signerAccount.type === AccountType.LEDGER) {
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and accept to sign the request",
      });
    }

    try {
      const result = await submitBatch(transfer, config);
      if (isBatch) {
        // TODO this will have to me moved in a thunk
        clearBatch(signerAccount.pkh);
      }
      onSucces(result.opHash);
      toast({ title: "Success", description: result.opHash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }

    setIsLoading(false);
  };

  const total = feeNum.plus(getBatchSubtotal(transfer));

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
              <AccountSmallTile pkh={signerAccount.pkh} />
            </Flex>
            {isBatch ? (
              <BatchRecap transfer={transfer} />
            ) : (
              <NonBatchRecap transfer={transfer[0]} />
            )}
            <Fee mutez={fee} />
          </Box>
          <Divider mb={2} mt={2} />
          <Total mutez={total.toString()} />
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
