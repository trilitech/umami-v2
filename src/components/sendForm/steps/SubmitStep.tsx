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
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { useGetSk } from "../../../utils/hooks/accountUtils";
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
  Subtotal,
  Total,
  TransactionsAmount,
} from "../components/TezAmountRecaps";
import { EstimatedOperation, OperationValue } from "../types";
import {
  LedgerSignerConfig,
  SignerConfig,
  SignerType,
  SkSignerConfig,
} from "../../../types/SignerConfig";

const makeTransfer = (
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
      return delegate(
        operation.value.sender,
        operation.value.recipient,
        config
      );
    case "tez":
      return transferTez(
        operation.value.recipient,
        operation.value.amount,
        config
      );
    case "token": {
      const token = operation.data;
      if (token.type !== "nft") {
        throw new Error("Should be nft");
      }
      return transferFA2Token(
        {
          amount: operation.value.amount,
          contract: token.contract,
          recipient: operation.value.recipient,
          sender: token.owner,
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
        <Subtotal tez={transfer.value.amount} />
      ) : null}
    </>
  );
};

const BatchRecap = ({ transfer }: { transfer: OperationValue[] }) => {
  return (
    <>
      <TransactionsAmount amount={transfer.length} />
      <Subtotal tez={getBatchSubtotal(transfer)} />
    </>
  );
};

const getSubTotal = (t: OperationValue[] | OperationValue): number => {
  if (Array.isArray(t)) {
    return getBatchSubtotal(t);
  }

  if (t.type === "tez") {
    return t.value.amount;
  }

  return 0;
};

export const RecapDisplay: React.FC<{
  network: TezosNetwork;
  recap: EstimatedOperation;
  onSucces: (hash: string) => void;
}> = ({ recap: { fee, operation: transfer }, network, onSucces }) => {
  const renderAccountTile = useRenderAccountSmallTile();
  const getAccount = useGetOwnedAccount();

  const getSk = useGetSk();
  const { register, handleSubmit } = useForm<{ password: string }>();

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const clearBatch = useClearBatch();

  const signerAccount = getAccount(
    (Array.isArray(transfer) ? transfer[0] : transfer).value.sender
  );

  const isGoogleSSO = signerAccount.type === AccountType.SOCIAL;
  const isLedger = signerAccount.type === AccountType.LEDGER;
  const isMnemonic = signerAccount.type === AccountType.MNEMONIC;

  const onSubmitGoogleSSO = async (sk: string) => {
    if (signerAccount.type === AccountType.MNEMONIC) {
      throw new Error(`Wrong signing method called`);
    }

    setIsLoading(true);
    try {
      const config: SkSignerConfig = {
        sk,
        network,
        type: SignerType.SK,
      };
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

  // TODO remove duplication
  const onSubmitNominal = async ({ password }: { password: string }) => {
    if (
      signerAccount.type === AccountType.SOCIAL ||
      signerAccount.type === AccountType.LEDGER
    ) {
      throw new Error(`Wrong signing method called`);
    }
    try {
      setIsLoading(true);
      const sk = await getSk(signerAccount, password);
      const config: SkSignerConfig = {
        sk,
        network,
        type: SignerType.SK,
      };
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
      onSucces(result.hash);
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
