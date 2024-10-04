import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import {
  useAsyncActionHandler,
  useAvailableNetworks,
  useGetImplicitAccount,
  walletKit,
} from "@umami/state";
import { type Network } from "@umami/tezos";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { CheckmarkIcon, CloseIcon } from "../../assets/icons";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { ProjectInfoCard } from "./ProjectInfoCard";
import { VerifyInfobox } from "./VerifyInfobox";

export const SessionProposalModal = ({
  proposal,
}: {
  proposal: WalletKitTypes.SessionProposal;
}) => {
  const getAccount = useGetImplicitAccount();
  const availableNetworks: Network[] = useAvailableNetworks();
  const toast = useToast();

  const { onClose } = useDynamicModalContext();
  const { handleAsyncAction } = useAsyncActionHandler();

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);

  const form = useForm<{ address: string }>({
    mode: "onBlur",
  });
  const {
    getValues,
    formState: { errors, isValid },
  } = form;

  // dApp sends in the session proposal the required networks and the optional networks.
  // The response must contain all the required networks but Umami supports just one per request.
  // So if the list of required networks is more than one or the required network is not supported, we can only reject the proposal.
  const requiredNetworks = Object.entries(proposal.params.requiredNamespaces)
    .map(([key, values]) => (key.includes(":") ? key : values.chains))
    .flat();

  let network = undefined;
  let error = undefined;
  if (requiredNetworks.length !== 1 || requiredNetworks[0] === undefined) {
    error = "Expected only one required network, got " + requiredNetworks;
  } else {
    network = requiredNetworks[0];
    const availablenetworks = availableNetworks.map(network => network.name);
    if (!availablenetworks.includes(network.split(":")[1])) {
      // the network contains a namespace, e.g. tezos:mainnet
      error = `The required network ${network} is not supported. Available: ${availablenetworks}`;
    }
  }

  if (error) {
    console.error(error);
    toast({ description: error, status: "error" });
  }

  const onApprove = () =>
    handleAsyncAction(async () => {
      setIsLoadingApprove(true);
      const account = getAccount(getValues().address);

      try {
        const namespaces = buildApprovedNamespaces({
          proposal: proposal.params,
          supportedNamespaces: {
            tezos: {
              chains: [network ?? ""],
              methods: ["tezos_getAccounts", "tezos_sign", "tezos_send"],
              events: [],
              accounts: [`${network}:${account.address.pkh}`],
            },
          },
        });

        await walletKit.approveSession({
          id: proposal.id,
          namespaces,
          sessionProperties: {},
        });
        onClose();
      } catch (e) {
        toast({ description: (e as Error).message, status: "error" });
        setIsLoadingApprove(false);
        // keeping the modal open to show that the approval failed
        return;
      }
    });

  // Handle reject action
  const onReject = () =>
    handleAsyncAction(async () => {
      // close immediately assuming that the user wants to get rid of the modal
      onClose();
      try {
        await walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError("USER_REJECTED_METHODS"),
        });
      } catch (e) {
        toast({ description: (e as Error).message, status: "error" });
        return;
      }
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalBody>
          <Card>
            <ProjectInfoCard metadata={proposal.params.proposer.metadata} />
            <Divider />
            <Box marginBottom="16px" fontSize="xl" fontWeight="semibold">
              Requested permissions
            </Box>

            <VStack align="start" spacing="8px">
              <HStack>
                <Icon as={CheckmarkIcon} />
                <Card marginLeft="8px">View your balance and activity</Card>
              </HStack>
              <HStack>
                <Icon as={CheckmarkIcon} />
                <Card marginLeft="8px">Send approval requests</Card>
              </HStack>
              <HStack color="gray.500">
                <Icon as={CloseIcon} />
                <Card marginLeft="8px">Move funds without permission</Card>
              </HStack>
            </VStack>

            <Box marginTop="8px">
              {network ? (
                <>
                  <FormControl marginTop="24px" isInvalid={!!errors.address}>
                    <OwnedImplicitAccountsAutocomplete
                      allowUnknown={false}
                      inputName="address"
                      label="Select Account"
                    />
                    {errors.address && (
                      <FormErrorMessage>{errors.address.message}</FormErrorMessage>
                    )}
                  </FormControl>
                  <Text marginTop="16px" color="gray.500">
                    Network:
                  </Text>
                  <Text marginLeft="8px">{network}</Text>
                </>
              ) : (
                <>
                  <Text color="gray.600">Accounts</Text>
                  <Text>None available</Text>
                  <Text marginTop="16px" color="gray.500">
                    Network
                  </Text>
                  <Text>None of the required networks is supported</Text>
                </>
              )}
            </Box>
            <Divider />
            <VerifyInfobox />
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button width="100%" isDisabled={isLoadingApprove} onClick={onReject} size="lg">
            Reject
          </Button>
          <Button
            width="100%"
            isDisabled={!!error || !isValid}
            isLoading={isLoadingApprove}
            loadingText="Approving..."
            onClick={onApprove}
            size="lg"
          >
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </FormProvider>
  );
};
