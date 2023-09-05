import {
  Center,
  Flex,
  FormControl,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
} from "@chakra-ui/react";
import { FormProvider } from "react-hook-form";
import colors from "../../../style/colors";
import { OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { NFTBalance } from "../../../types/TokenBalance";
import { SendNFTRecapTile } from "../../sendForm/components/SendNFTRecapTile";
import { FA2Transfer } from "../../../types/Operation";
import { OperationSignerSelector } from "../OperationSignerSelector";
import SignPageFee from "../SignPageFee";

const SignPage: React.FC<SignPageProps<{ nft: NFTBalance }>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { nft },
  } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <Flex my={3}>
              <SendNFTRecapTile nft={nft} />
            </Flex>

            <Flex my={3} alignItems="center" justifyContent="space-between" px={1}>
              <Flex alignItems="center">
                <Heading size="sm" mr={1} color={colors.gray[450]}>
                  Owned:
                </Heading>
                <Text size="sm" data-testid="nft-owned" color={colors.gray[400]}>
                  {nft.balance}
                </Text>
              </Flex>

              <SignPageFee fee={fee} />
            </Flex>
            <Flex my={4} alignItems="center">
              <Heading size="md" mr={3}>
                Quantity:
              </Heading>
              <Center w="100px" h="48px" bg={colors.gray[800]}>
                <Text textAlign="center">
                  {(operations.operations[0] as FA2Transfer).amount} out of {nft.balance}
                </Text>
              </Center>
            </Flex>

            {/* TODO: Add sender address tile */}
            <FormControl my={3}>
              <OwnedAccountsAutocomplete
                inputName="sender"
                label="From"
                allowUnknown={false}
                isDisabled
              />
            </FormControl>

            {/* TODO: Add recipient address tile */}

            <OperationSignerSelector
              sender={operations.sender}
              isDisabled={isLoading}
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
