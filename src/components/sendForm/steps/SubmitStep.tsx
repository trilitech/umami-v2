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
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import { AccountType } from "../../../types/Account";
import { SignerConfig } from "../../../types/SignerConfig";
import { useGetOwnedAccount } from "../../../utils/hooks/accountHooks";
import { getBatchSubtotal } from "../../../views/batch/batchUtils";
import { useRenderBakerSmallTile } from "../../../views/delegations/BakerSmallTile";
import { AccountSmallTile } from "../../AccountSelector/AccountSmallTile";
import { SendNFTRecapTile } from "../components/SendNFTRecapTile";
import SignButton from "../components/SignButton";
import { Fee, Subtotal, Total } from "../components/TezAmountRecaps";
import { EstimatedOperation, FormOperations, OperationValue } from "../types";
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

const getSigner = (ops: FormOperations) => {
  if (ops.type === "implicit") {
    return ops.content[0].value.sender;
  }
  return ops.signer;
};

const useGetImplicitAccount = () => {
  const getAccount = useGetOwnedAccount();
  return (pkh: string) => {
    const account = getAccount(pkh);
    if (account.type === AccountType.MULTISIG) {
      throw Error(`Account ${pkh} is not implicit`);
    }

    return account;
  };
};

export const SubmitStep: React.FC<{
  network: TezosNetwork;
  recap: EstimatedOperation;
  isBatch: boolean;
  onSubmit: (signerConfig: SignerConfig) => void;
  isLoading: boolean;
}> = ({ recap: { fee, operations }, network, isBatch, onSubmit, isLoading }) => {
  const feeNum = new BigNumber(fee);
  const getAccount = useGetImplicitAccount();

  const transfer = operations.content;
  const signerAccount = getAccount(getSigner(operations));

  const total = feeNum.plus(getBatchSubtotal(transfer));

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
              <AccountSmallTile pkh={signerAccount.address.pkh} />
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
        <ModalFooter justifyContent="center">
          <SignButton
            isLoading={isLoading}
            network={network}
            onSubmit={onSubmit}
            signerAccount={signerAccount}
          />
        </ModalFooter>
      </form>
    </ModalContent>
  );
};
