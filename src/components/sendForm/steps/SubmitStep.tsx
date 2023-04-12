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
import { Estimate } from "@taquito/taquito";
import { isValid } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleAuth } from "../../../GoogleAuth";
import { AccountType } from "../../../types/Account";
import { decrypt } from "../../../utils/aes";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import {
  mutezToTezNumber,
  prettyTezAmount,
} from "../../../utils/store/impureFormat";
import { delegate, transferFA2Token, transferTez } from "../../../utils/tezos";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { useRenderAccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import { TransactionValues } from "../types";

const makeTransfer = (
  t: TransactionValues,
  sk: string,
  network: TezosNetwork
) => {
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

const renderSubTotal = (t: TransactionValues) => {
  return t.type === "tez" ? (
    <Flex
      aria-label="sub-total"
      alignItems={"center"}
      justifyContent="space-between"
      mb={2}
    >
      <Heading size="sm" color="text.dark">
        Subtotal
      </Heading>
      <Text size="sm">{prettyTezAmount(t.values.amount, true)}</Text>
    </Flex>
  ) : null;
};

export const RecapDisplay: React.FC<{
  network: TezosNetwork;
  recap: {
    transaction: TransactionValues;
    estimate: Estimate;
  };
  onSucces: (hash: string) => void;
}> = ({ recap: { estimate, transaction: transfer }, network, onSucces }) => {
  const isTez = transfer.type === "tez";
  const isDelegation = transfer.type === "delegation";
  const nft = transfer.type === "nft" ? transfer.data : undefined;
  const renderAccountTile = useRenderAccountSmallTile();
  const renderBakerTile = useRenderBakerSmallTile();
  const getAccount = useGetOwnedAccount();

  const { register, handleSubmit } = useForm<{ password: string }>();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const signerAccount = getAccount(transfer.values.sender);

  const isGoogleSSO = signerAccount.type === AccountType.SOCIAL;

  const onSubmitGoogleSSO = async (sk: string) => {
    if (signerAccount.type === AccountType.MNEMONIC) {
      throw new Error(`Wrong signing method called`);
    }

    setIsLoading(true);
    try {
      const result = await makeTransfer(transfer, sk, network);

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

      onSucces(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }
    setIsLoading(false);
  };

  const feeInTez = Number(mutezToTezNumber(estimate.suggestedFeeMutez));
  const total = isTez ? feeInTez + Number(transfer.values.amount) : feeInTez;

  return (
    <ModalContent bg="umami.gray.900">
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
              {renderAccountTile(transfer.values.sender)}
            </Flex>
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
            {renderSubTotal(transfer)}
            <Flex
              aria-label="fee"
              alignItems={"center"}
              justifyContent="space-between"
            >
              <Heading size="sm" color="text.dark">
                Fee
              </Heading>
              <Text size="sm">
                {prettyTezAmount(estimate.suggestedFeeMutez)}
              </Text>
            </Flex>
          </Box>
          <Divider mb={2} mt={2} />
          <Flex
            aria-label="total"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Heading size="sm" color="text.dark">
              Total
            </Heading>
            <Text size="sm">{prettyTezAmount(total, true)}</Text>
          </Flex>
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
