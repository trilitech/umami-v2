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
import { NFT } from "../../../types/Asset";
import { UmamiEncrypted } from "../../../types/UmamiEncrypted";
import {
  mutezToTezNumber,
  prettyTezAmount,
} from "../../../utils/store/impureFormat";
import { transferFA2Token, transferTez } from "../../../utils/tezos";
import { AccountRecapTile } from "../AccountSelector";
import { TransferFormValuesBase } from "./FillTransactionStep";
import { SendNFTDisplay } from "./SendNFTDisplay";

export const RecapDisplay: React.FC<{
  recap: {
    network: TezosNetwork;
    transfer: TransferFormValuesBase;
    estimate: Estimate;
    esk: UmamiEncrypted;
    nft?: NFT;
  };
  onSucces: (hash: string) => void;
}> = ({ recap: { estimate, transfer, esk, network, nft }, onSucces }) => {
  const isNft = !!nft;
  const { register, handleSubmit } = useForm<{ password: string }>();
  const toast = useToast();
  let [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ password }: { password: string }) => {
    setIsLoading(true);
    try {
      const result = await (nft
        ? transferFA2Token(
            network,
            {
              amount: transfer.amount,
              contract: nft.contract,
              recipient: transfer.recipient,
              sender: nft.owner,
              tokenId: nft.tokenId,
            },
            esk,
            password
          )
        : transferTez(
            transfer.recipient,
            transfer.amount,
            esk,
            password,
            network
          ));
      onSucces(result.hash);
      toast({ title: "Success", description: result.hash });
    } catch (error: any) {
      toast({ title: "Error", description: error.message });
    }
    setIsLoading(false);
  };
  const feeInTez = Number(mutezToTezNumber(estimate.suggestedFeeMutez));
  const total = isNft ? feeInTez : feeInTez + Number(transfer.amount);

  return (
    <ModalContent bg="umami.gray.900">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign={"center"}>Recap</ModalHeader>
        <Text textAlign={"center"}>Transaction details</Text>
        <ModalBody mt={4}>
          <Box>
            <Flex mb={4}>
              <Heading size="md" width={20}>
                From:
              </Heading>
              <AccountRecapTile pkh={transfer.sender} />
            </Flex>
            <Flex mb={4}>
              <Heading size="md" width={20}>
                To:
              </Heading>
              <AccountRecapTile pkh={transfer.recipient} />
            </Flex>
            {isNft ? (
              <Box mb={4}>
                <SendNFTDisplay nft={nft} />
              </Box>
            ) : (
              <Flex
                aria-label="sub-total"
                alignItems={"center"}
                justifyContent="space-between"
                mb={2}
              >
                <Heading size="sm" color="text.dark">
                  Subtotal
                </Heading>
                <Text size="sm">{prettyTezAmount(transfer.amount, true)}</Text>
              </Flex>
            )}

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
        </ModalBody>
        <ModalFooter>
          <Button
            bg="umami.blue"
            width={"100%"}
            isLoading={isLoading}
            type="submit"
            isDisabled={!isValid || isLoading}
          >
            Submit Transaction
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
