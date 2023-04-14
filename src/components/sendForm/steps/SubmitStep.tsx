import { TezosNetwork } from "@airgap/tezos";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { isValid } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuth } from "../../../GoogleAuth";
import { AccountType } from "../../../types/Account";
import { decrypt } from "../../../utils/aes";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useClearBatch } from "../../../utils/hooks/assetsHooks";
import { mutezToTezNumber } from "../../../utils/store/impureFormat";
import {
  delegate,
  submitBatch,
  transferFA2Token,
  transferTez,
} from "../../../utils/tezos";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { useRenderAccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import {
  Fee,
  TransactionsAmount,
  Subtotal,
  Total,
} from "../components/TezAmountRecaps";
import { MyEstimate } from "../SendForm";
import { TransactionValues } from "../types";

const makeTransfer = (
  t: TransactionValues | TransactionValues[],
  sk: string,
  network: TezosNetwork
) => {
  if (Array.isArray(t)) {
    return submitBatch(t, sk, network).then((res) => {
      return {
        hash: res.opHash,
      };
    });
  }

  if (t.type === "delegation") {
    return delegate(t.values.sender, t.values.recipient, sk, network);
  }

  if (t.type === "tez") {
    return transferTez(t.values.recipient, t.values.amount, sk, network);
  }

  if (t.type === "nft") {
    const nft = t.data;
    return transferFA2Token(
      {
        amount: t.values.amount,
        contract: nft.contract,
        recipient: t.values.recipient,
        sender: nft.owner,
        tokenId: nft.tokenId,
      },
      sk,
      network
    );
  }

  const error: never = t;
  throw new Error(error);
};

const NonBatchRecap = ({ transfer }: { transfer: TransactionValues }) => {
  const isDelegation = transfer.type === "delegation";
  const nft = transfer.type === "nft" ? transfer.data : undefined;

  const renderAccountTile = useRenderAccountSmallTile();
  const renderBakerTile = useRenderBakerSmallTile();
  return (
    <>
      {transfer.values.recipient && (
        <Flex mb={4}>
          <Heading size="md" width={20}>
            To:
          </Heading>
          {isDelegation
            ? renderBakerTile(transfer.values.recipient)
            : renderAccountTile(transfer.values.recipient)}
        </Flex>
      )}
      {!!nft && (
        <Box mb={4}>
          <SendNFTRecapTile nft={nft} />
        </Box>
      )}
      {transfer.type === "tez" ? (
        <Subtotal tez={transfer.values.amount} />
      ) : null}
    </>
  );
};

const BatchRecap = ({ transfer }: { transfer: TransactionValues[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal tez={getBatchSubtotal(transfer)} />
    </>
  );
};

const getSubTotal = (t: TransactionValues[] | TransactionValues): number => {
  if (Array.isArray(t)) {
    return getBatchSubtotal(t);
  }

  if (t.type === "tez") {
    return t.values.amount;
  }

  return 0;
};

export const RecapDisplay: React.FC<{
  network: TezosNetwork;
  recap: MyEstimate;
  onSucces: (hash: string) => void;
}> = ({ recap: { estimate, transaction: transfer }, network, onSucces }) => {
  const renderAccountTile = useRenderAccountSmallTile();
  const getAccount = useGetOwnedAccount();

  const { register, handleSubmit } = useForm<{ password: string }>();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearBatch = useClearBatch();

  const signerAccount = getAccount(
    (Array.isArray(transfer) ? transfer[0] : transfer).values.sender
  );

  const isGoogleSSO = signerAccount.type === AccountType.SOCIAL;

  const onSubmitGoogleSSO = async (sk: string) => {
    if (signerAccount.type === AccountType.MNEMONIC) {
      throw new Error(`Wrong signing method called`);
    }

    setIsLoading(true);
    try {
      const result = await makeTransfer(transfer, sk, network);

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

  // TODO remove duplication
  const onSubmitNominal = async ({ password }: { password: string }) => {
    if (signerAccount.type === AccountType.SOCIAL) {
      throw new Error(`Wrong signing method called`);
    }

    setIsLoading(true);
    try {
      const sk = await decrypt(signerAccount.esk, password);

      const result = await makeTransfer(transfer, sk, network);

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

  const feeInTez = Number(mutezToTezNumber(estimate.suggestedFeeMutez));
  const total = feeInTez + getSubTotal(transfer);

  return (
    <ModalContent bg="umami.gray.900" data-testid="bar">
      <form onSubmit={handleSubmit(onSubmitNominal)}>
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
            <Fee mutez={estimate.suggestedFeeMutez} />
          </Box>
          <Divider mb={2} mt={2} />
          <Total tez={total} />
          {isGoogleSSO ? (
            <GoogleAuth
              isLoading={isLoading}
              bg="umami.blue"
              width={"100%"}
              buttonText="Submit Transaction"
              onReceiveSk={onSubmitGoogleSSO}
            />
          ) : (
            <FormControl isInvalid={false} mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: true,
                  minLength: 4,
                })}
                placeholder="Enter password..."
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          {isGoogleSSO ? null : (
            <Button
              bg="umami.blue"
              width={"100%"}
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || isLoading}
            >
              Submit Transaction
            </Button>
          )}
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
