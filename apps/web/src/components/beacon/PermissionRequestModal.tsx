import {
  BeaconMessageType,
  type BeaconResponseInputMessage,
  type PermissionRequestOutput,
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
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  WalletClient,
  useAddBeaconConnection,
  useAsyncActionHandler,
  useGetImplicitAccount,
} from "@umami/state";
import { capitalize } from "lodash";
import { FormProvider, useForm } from "react-hook-form";

import { CodeSandboxIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { ModalCloseButton } from "../CloseButton";
import { JsValueWrap } from "../JsValueWrap";

export const PermissionRequestModal = ({ request }: { request: PermissionRequestOutput }) => {
  const color = useColor();
  const addConnectionToBeaconSlice = useAddBeaconConnection();
  const getAccount = useGetImplicitAccount();
  const { onClose } = useDynamicModalContext();
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
        <Text marginTop="10px" color={color("700")} textAlign="center" size="sm">
          {request.appMetadata.name} is requesting permission to sign this operation.
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody data-testid="beacon-request-body">
        <Flex
          alignItems="center"
          marginTop="16px"
          padding="15px"
          borderRadius="4px"
          backgroundColor={color("100")}
        >
          <AspectRatio width="60px" marginRight="12px" ratio={1}>
            <Image
              borderRadius="4px"
              objectFit="cover"
              fallback={<CodeSandboxIcon width="36px" height="36px" />}
              src={request.appMetadata.icon}
            />
          </AspectRatio>
          <Heading size="sm">{request.appMetadata.name}</Heading>
        </Flex>

        <Flex alignItems="center" justifyContent="space-between" marginTop="12px">
          <Flex alignItems="center" gap="4px">
            <Text size="sm">Suspicious DApp? </Text>
            <Link
              fontSize="14px"
              textDecoration="underline"
              href="mailto:umami-support@trili.tech"
              isExternal
            >
              Report
            </Link>
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <Heading marginRight="4px" color={color("700")} size="md">
              Network:
            </Heading>
            <Text color={color("700")} fontWeight="400">
              {capitalize(request.network.type)}
            </Text>
          </Flex>
        </Flex>

        <Accordion marginTop="16px" allowToggle={true}>
          <AccordionItem background={color("100")} border="none" borderRadius="8px">
            <AccordionButton borderRadius="full">
              <Heading flex="1" textAlign="left" marginY="10px" size="md">
                Request
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel padding="10px 0 0">
              <JsValueWrap overflow="auto" maxHeight="250px" value={request} />
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
        <Button width="100%" isDisabled={!isValid} onClick={grant} variant="primary">
          Allow
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
