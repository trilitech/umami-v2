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
import { AvailableSignersAutocomplete, OwnedAccountsAutocomplete } from "../../AddressAutocomplete";
import SignButton from "../../sendForm/components/SignButton";
import { mutezToPrettyTez, SignPageProps, useSignPageHelpers } from "../utils";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { NFTBalance } from "../../../types/TokenBalance";
import { SendNFTRecapTile } from "../../sendForm/components/SendNFTRecapTile";
import { FA2Operation } from "../../../types/Operation";

const SignPage: React.FC<SignPageProps<{ nft: NFTBalance }>> = props => {
  const { mode, operations: initialOperations, fee: initialFee } = props;
  const { fee, operations, estimationFailed, isLoading, form, signer, reEstimate, onSign } =
    useSignPageHelpers(initialFee, initialOperations, mode);
  const nft = props.data?.nft;
  if (!nft) {
    return null;
  }
  return (
    <FormProvider {...form}>
      <ModalContent bg={colors.gray[900]} borderColor={colors.gray[700]} borderRadius="8px">
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
                <Text size="sm" color={colors.gray[400]}>
                  {nft.balance}
                </Text>
              </Flex>
              <Flex>
                <Text size="sm" mr={1} color={colors.gray[450]}>
                  Fee:
                </Text>
                <Text size="sm" data-testid="fee" color={colors.gray[400]}>
                  {mutezToPrettyTez(fee)}
                </Text>
              </Flex>
            </Flex>
            <Flex my={4} alignItems="center">
              <Heading size="md" mr={3}>
                Quantity:
              </Heading>
              <Center w="100px" h="48px" bg={colors.gray[800]}>
                <Text textAlign="center">
                  {(operations.content[0] as FA2Operation).amount} out of {nft.balance}
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

            {initialOperations.type === "proposal" && (
              <FormControl>
                <AvailableSignersAutocomplete
                  account={initialOperations.sender}
                  inputName="signer"
                  label="Select Proposer"
                  isDisabled={isLoading}
                  onUpdate={reEstimate}
                  keepValid
                />
              </FormControl>
            )}
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
