import {
  Center,
  Flex,
  FormLabel,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { NFTBalance } from "../../../types/TokenBalance";
import { FA2Transfer } from "../../../types/Operation";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";
import AddressTile from "../../AddressTile/AddressTile";
import SignButton from "../SignButton";
import { SendNFTRecapTile } from "../SendNFTRecapTile";

const SignPage: React.FC<SignPageProps<{ nft: NFTBalance }>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { nft },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  const { recipient } = operations.operations[0] as FA2Transfer;

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <Flex mb="12px">
              <SendNFTRecapTile nft={nft} />
            </Flex>

            <Flex my="12px" px="4px" alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <Heading size="sm" mr="4px" color={colors.gray[450]}>
                  Owned:
                </Heading>
                <Text size="sm" data-testid="nft-owned" color={colors.gray[400]}>
                  {nft.balance}
                </Text>
              </Flex>

              <SignPageFee fee={fee} />
            </Flex>

            <Flex mt="12px" mb="24px" alignItems="center">
              <Heading size="md" mr="12px">
                Quantity:
              </Heading>
              <Center w="100px" h="48px" bg={colors.gray[800]} borderRadius="4px">
                <Text textAlign="center">
                  {(operations.operations[0] as FA2Transfer).amount} out of {nft.balance}
                </Text>
              </Center>
            </Flex>

            <FormLabel>From</FormLabel>
            <AddressTile mb="24px" address={operations.sender.address} />
            <FormLabel>To</FormLabel>
            <AddressTile address={recipient} />

            <OperationSignerSelector
              sender={operations.sender}
              isLoading={isLoading}
              operationType={operations.type}
              reEstimate={reEstimate}
            />
          </ModalBody>
          <ModalFooter>
            <SignButton
              isLoading={isLoading}
              isDisabled={estimationFailed}
              signer={signer}
              onSubmit={onSign}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
export default SignPage;
