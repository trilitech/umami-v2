import {
  BeaconMessageType,
  BeaconResponseInputMessage,
  PermissionRequestOutput,
} from "@airgap/beacon-wallet";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { JsValueWrap } from "../../../../components/AccountDrawer/JsValueWrap";
import { OwnedImplicitAccountsAutocomplete } from "../../../../components/AddressAutocomplete";
import colors from "../../../../style/colors";
import { useAddConnection } from "../../../hooks/beaconHooks";
import { useImplicitAccounts } from "../../../hooks/getAccountDataHooks";
import { walletClient } from "../../beacon";

export const PermissionRequestPanel: React.FC<{
  request: PermissionRequestOutput;
  onSuccess: () => void;
}> = ({ request, onSuccess: onSubmit }) => {
  const addConnectionToBeaconSlice = useAddConnection();
  const accounts = useImplicitAccounts();
  const form = useForm<{ address: string }>({
    mode: "onBlur",
  });
  const {
    getValues,
    formState: { errors, isValid },
  } = form;

  const grant = async () => {
    const account = accounts.find(acc => acc.address.pkh === getValues().address);
    if (!account) {
      throw new Error("No account selected");
    }
    const response: BeaconResponseInputMessage = {
      type: BeaconMessageType.PermissionResponse,
      network: { type: request.network.type }, // Use the same network that the user requested
      scopes: request.scopes,
      id: request.id,
      publicKey: account.pk,
    };

    await walletClient.respond(response);

    addConnectionToBeaconSlice(request.senderId, account.address.pkh);

    onSubmit();
  };

  return (
    <ModalContent>
      <ModalHeader marginBottom="24px">
        <Flex alignItems="center" justifyContent="center">
          Permission Request
        </Flex>
        <Flex alignItems="center" justifyContent="center" marginTop="10px">
          <Heading color={colors.gray[400]} size="sm">
            {request.appMetadata.name}
            <Text display="inline" marginLeft="4px" size="sm">
              is requesting permission to sign this operation.
            </Text>
          </Heading>
        </Flex>

        <Flex alignItems="center" justifyContent="center" marginTop="10px">
          <Heading marginRight="4px" color={colors.gray[450]} size="sm">
            Network:
          </Heading>
          <Text color={colors.gray[400]} size="sm">
            {request.network.type}
          </Text>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody data-testid="beacon-request-body">
        {request.appMetadata.icon && (
          <Flex
            alignItems="center"
            marginTop="16px"
            padding="15px"
            borderRadius="4px"
            backgroundColor={colors.gray[800]}
          >
            <AspectRatio width="60px" marginRight="12px" ratio={1}>
              <Image borderRadius="4px" src={request.appMetadata.icon} />
            </AspectRatio>
            <Heading size="sm">{request.appMetadata.name}</Heading>
          </Flex>
        )}

        <Accordion marginTop="16px" allowToggle={true}>
          <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
            <AccordionButton>
              <Heading flex="1" textAlign="left" marginY="10px" size="md">
                Request Payload
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <JsValueWrap value={request} />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <FormProvider {...form}>
          <FormControl marginTop="24px" isInvalid={!!errors.address}>
            <OwnedImplicitAccountsAutocomplete
              allowUnknown={false}
              inputName="address"
              label="Select Account"
            />
            {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
          </FormControl>
        </FormProvider>
      </ModalBody>
      <ModalFooter>
        <Button isDisabled={!isValid} onClick={_ => grant()}>
          Grant
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
