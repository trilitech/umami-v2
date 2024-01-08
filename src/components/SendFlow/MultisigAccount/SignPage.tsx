import {
  Box,
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

import { FormValues } from "./FormPage";
import colors from "../../../style/colors";
import { parsePkh } from "../../../types/Address";
import { AddressTile } from "../../AddressTile/AddressTile";
import { SignButton } from "../SignButton";
import { SignPageFee } from "../SignPageFee";
import { SignPageHeader, headerText } from "../SignPageHeader";
import { SignPageProps, useSignPageHelpers } from "../utils";

export const SignPage: React.FC<SignPageProps<FormValues>> = props => {
  const {
    mode,
    operations: initialOperations,
    fee: initialFee,
    data: { threshold, signers, name, sender },
  } = props;

  const { fee, operations, estimationFailed, isLoading, form, signer, onSign } = useSignPageHelpers(
    initialFee,
    initialOperations,
    mode
  );

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form>
          <SignPageHeader {...props} operationsType={operations.type} />
          <ModalBody>
            <FormLabel>Contract Name</FormLabel>
            <Text
              marginBottom="24px"
              padding="14px"
              color={colors.gray[50]}
              background={colors.gray[800]}
              borderRadius="6px"
              data-testid="contract-name"
            >
              {name}
            </Text>

            <Box marginBottom="24px">
              <FormLabel>Owner</FormLabel>
              <AddressTile
                marginBottom="12px"
                address={parsePkh(sender)}
                data-testid="multisig-owner"
              />
              <Flex justifyContent="flex-end">
                <SignPageFee fee={fee} />
              </Flex>
            </Box>

            <FormLabel>Approvers</FormLabel>
            <Box data-testid="approvers">
              {signers.map(signer => {
                return (
                  <AddressTile
                    key={signer.val}
                    marginBottom="12px"
                    address={parsePkh(signer.val)}
                    data-testid={`approver-${signer.val}`}
                  />
                );
              })}
            </Box>

            <Flex alignItems="center" marginTop="24px" marginBottom="24px">
              <Heading marginRight="12px" size="md">
                Min No. of approvals:
              </Heading>
              <Center width="100px" height="48px" background={colors.gray[800]} borderRadius="4px">
                <Text textAlign="center" data-testid="threshold">
                  {threshold} out of {signers.length}
                </Text>
              </Center>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <SignButton
              isDisabled={estimationFailed}
              isLoading={isLoading}
              onSubmit={onSign}
              signer={signer}
              text={headerText(operations.type, mode)}
            />
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
