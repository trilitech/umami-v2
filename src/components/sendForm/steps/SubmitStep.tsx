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
} from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import { Operation } from "../../../types/Operation";
import { useGetToken } from "../../../utils/hooks/tokensHooks";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import SignButton from "../components/SignButton";
import { Fee, Subtotal, Total } from "../components/TezAmountRecaps";
import { EstimatedOperation } from "../types";
import { BatchRecap } from "./BatchRecap";
import { BakerSmallTile } from "../../../views/delegations/BakerSmallTile";

const NonBatchRecap = ({ transfer }: { transfer: Operation }) => {
  const isDelegation = transfer.type === "delegation";
  const getToken = useGetToken();
  const token =
    transfer.type === "fa1.2" || transfer.type === "fa2"
      ? getToken(transfer.contract.pkh, transfer.tokenId)
      : undefined;

  return (
    <>
      {/* eslint-disable-next-line  @typescript-eslint/no-unnecessary-condition */}
      {"recipient" in transfer && transfer.recipient !== undefined && (
        <Flex mb={4}>
          <Heading size="md" width={20}>
            To:
          </Heading>
          {isDelegation ? (
            <BakerSmallTile pkh={transfer.recipient.pkh} />
          ) : (
            <AccountSmallTile pkh={transfer.recipient.pkh} />
          )}
        </Flex>
      )}
      {token?.type === "nft" && (
        <Box mb={4}>
          <SendNFTRecapTile nft={token} />
        </Box>
      )}
      {transfer.type === "tez" ? <Subtotal mutez={transfer.amount} /> : null}
    </>
  );
};

export const SubmitStep: React.FC<{
  recap: EstimatedOperation;
  isBatch: boolean;
  onSubmit: (tezosToolkit: TezosToolkit) => Promise<void>;
}> = ({ recap: { fee, operations }, isBatch, onSubmit }) => {
  const transfer = operations.content;

  return (
    <ModalContent bg="umami.gray.900" data-testid="bar">
      <form>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Recap</ModalHeader>
        <Text textAlign="center">Transaction details</Text>
        <ModalBody mt={4}>
          <Box>
            <Flex mb={4}>
              <Heading size="md" width={20}>
                From:
              </Heading>
              <AccountSmallTile pkh={operations.sender.address.pkh} />
            </Flex>
            {isBatch ? (
              <BatchRecap transfer={transfer} />
            ) : (
              <NonBatchRecap transfer={transfer[0]} />
            )}
            <Fee mutez={fee} />
          </Box>
          <Divider mb={2} mt={2} />
          <Total mutez={fee} />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <SignButton onSubmit={onSubmit} signer={operations.signer} />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
