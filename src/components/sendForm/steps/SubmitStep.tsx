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
import {
  LedgerSignerConfig,
  SignerConfig,
  SignerType,
  SkSignerConfig,
} from "../../../types/SignerConfig";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useGetSk } from "../../../utils/hooks/accountUtils";
import { useClearBatch } from "../../../utils/hooks/assetsHooks";
import { mutezToTezNumber } from "../../../utils/store/impureFormat";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { useRenderAccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import {
  Fee,
  Subtotal,
  Total,
  TransactionsAmount,
} from "../components/TezAmountRecaps";
import { EstimatedTransaction, TransactionValues } from "../types";
import { delegate, submitBatch, transferFA2Token, transferTez } from "../../../utils/tezos/operations";

const makeTransfer = (
  t: TransactionValues | TransactionValues[],
  config: SignerConfig
) => {
  if (Array.isArray(t)) {
    return submitBatch(t, config).then((res) => {
      return {
        hash: res.opHash,
      };
    });
  }

  if (t.type === "delegation") {
    return delegate(t.values.sender, t.values.recipient, config);
  }

  if (t.type === "tez") {
    return transferTez(t.values.recipient, t.values.amount, config);
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
      config
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
  recap: EstimatedTransaction;
  onSucces: (hash: string) => void;
}> = ({ recap: { fee, transaction: transfer }, network, onSucces }) => {
  const renderAccountTile = useRenderAccountSmallTile();
  const getAccount = useGetOwnedAccount();

  const getSk = useGetSk();
  const { register, handleSubmit } = useForm<{ password: string }>();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearBatch = useClearBatch();

  const signerAccount = getAccount(
    (Array.isArray(transfer) ? transfer[0] : transfer).values.sender
  );

  const isGoogleSSO = signerAccount.type === AccountType.SOCIAL;
  const isLedger = signerAccount.type === AccountType.LEDGER;
  const isMnemonic = signerAccount.type === AccountType.MNEMONIC;

  const onSubmitGoogleSSO = async (sk: string) => {
    setIsLoading(true);
    try {
      const config: SkSignerConfig = {
        sk,
        network,
        type: SignerType.SK
      }
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

  const onSubmitNominal = async ({ password }: { password: string }) => {
    if (
      signerAccount.type === AccountType.SOCIAL ||
      signerAccount.type === AccountType.LEDGER
    ) {
      throw new Error(`Wrong signing method called`);
    }
    if (password && isMnemonic) {
      try {
        setIsLoading(true);
        const sk = await getSk(signerAccount, password);
        const config: SkSignerConfig = {
          sk,
          network,
          type: SignerType.SK
        }
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
    } else {
      throw new Error(`Unknown signing method`);
    }
  };

  const onSubmitLedger = async () => {
    if (
      signerAccount.type === AccountType.MNEMONIC ||
      signerAccount.type === AccountType.SOCIAL
    ) {
      throw new Error("Wrong account type");
    }

    setIsLoading(true);
    try {
      toast({
        title: "Request sent to Ledger",
        description:
          "Open the Tezos app on your Ledger and accept to sign the request",
      });
      const config: LedgerSignerConfig = {
        network,
        derivationPath: signerAccount.derivationPath,
        derivationType: signerAccount.curve,
        type: SignerType.LEDGER,
      };

      const result = await makeTransfer(transfer, config);

      if (Array.isArray(transfer)) {
        clearBatch(signerAccount.pkh);
      }
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }
    setIsLoading(false);
  };

  const feeInTez = Number(mutezToTezNumber(fee));
  const total = feeInTez + getSubTotal(transfer);

  return (
    <ModalContent bg="umami.gray.900" data-testid="bar">
      <form
        onSubmit={handleSubmit(isLedger ? onSubmitLedger : onSubmitNominal)}
      >
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
          {isMnemonic ? (
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
          ) : null}
        </ModalBody>
        <ModalFooter>
          {isGoogleSSO ? (
            <GoogleAuth
              isLoading={isLoading}
              bg="umami.blue"
              width={"100%"}
              buttonText="Sign with Google"
              onReceiveSk={onSubmitGoogleSSO}
            />
          ) : (
            <Button
              bg="umami.blue"
              width={"100%"}
              isLoading={isLoading}
              type="submit"
              isDisabled={!isValid || isLoading}
            >
              {isLedger ? <>Sign with Ledger</> : <>Submit Transaction</>}
            </Button>
          )}
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
