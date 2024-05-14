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
import { capitalize } from "lodash";
import React, { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { WalletClient } from "./WalletClient";
import { JsValueWrap } from "../../components/AccountDrawer/JsValueWrap";
import { OwnedImplicitAccountsAutocomplete } from "../../components/AddressAutocomplete";
import { DynamicModalContext } from "../../components/DynamicModal";
import colors from "../../style/colors";
import { useAddConnection } from "../hooks/beaconHooks";
import { useGetImplicitAccount } from "../hooks/getAccountDataHooks";
import { useAsyncActionHandler } from "../hooks/useAsyncActionHandler";

export const PermissionRequestModal: React.FC<{
  request: PermissionRequestOutput;
}> = ({ request }) => {
  const addConnectionToBeaconSlice = useAddConnection();
  const getAccount = useGetImplicitAccount();
  const { onClose } = useContext(DynamicModalContext);
  const { handleAsyncAction } = useAsyncActionHandler();
  const form = useForm<{ address: string }>({
    mode: "onBlur",
  });
  const {
    getValues,
    formState: { errors, isValid },
  } = form;

  const grant = () =>
    handleAsyncAction(async () => {
      const account = getAccount(getValues().address);
      const response: BeaconResponseInputMessage = {
        type: BeaconMessageType.PermissionResponse,
        network: request.network,
        scopes: request.scopes,
        id: request.id,
        publicKey: account.pk,
        // TODO: update when we start supporting abstracted accounts
        walletType: "implicit",
      };

      await WalletClient.respond(response);

      addConnectionToBeaconSlice(request.senderId, account.address.pkh, request.network.type);
    }).finally(onClose);

  return (
    <ModalContent>
      <ModalHeader marginBottom="24px">
        <Flex alignItems="center" justifyContent="center">
          Permission Request
        </Flex>
        <Text marginTop="10px" color={colors.gray[400]} textAlign="center" size="sm">
          {request.appMetadata.name} is requesting permission to sign this operation.
        </Text>

        <Flex alignItems="center" justifyContent="center" marginTop="10px">
          <Heading marginRight="4px" color={colors.gray[450]} size="sm">
            Network:
          </Heading>
          <Text color={colors.gray[400]} size="sm">
            {capitalize(request.network.type)}
          </Text>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody data-testid="beacon-request-body">
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

        <Accordion marginTop="16px" allowToggle={true}>
          <AccordionItem background={colors.gray[800]} border="none" borderRadius="8px">
            <AccordionButton>
              <Heading flex="1" textAlign="left" marginY="10px" size="md">
                Request
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
        <Button width="100%" isDisabled={!isValid} onClick={grant} size="lg">
          Sign
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
