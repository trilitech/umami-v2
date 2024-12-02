import { type NetworkType } from "@airgap/beacon-wallet";
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
} from "@chakra-ui/react";
import { type WalletKitTypes } from "@reown/walletkit";
import { useDynamicModalContext } from "@umami/components";
import { useAsyncActionHandler, useGetImplicitAccount, walletKit } from "@umami/state";
import { type SessionTypes } from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { FormProvider, useForm } from "react-hook-form";

import { CheckmarkIcon, CloseIcon } from "../../assets/icons";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { ProjectInfoCard } from "./ProjectInfoCard";
import { VerifyInfobox } from "./VerifyInfobox";
import { useColor } from "../../styles/useColor";

export const SessionProposalModal = ({
  proposal,
  network,
}: {
  proposal: WalletKitTypes.SessionProposal;
  network: NetworkType;
}) => {
  const getAccount = useGetImplicitAccount();
  const color = useColor();

  const { onClose } = useDynamicModalContext();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const form = useForm<{ address: string }>({
    mode: "onBlur",
  });
  const {
    getValues,
    formState: { errors, isValid },
  } = form;

  const onApprove = () =>
    handleAsyncAction(async () => {
      const account = getAccount(getValues("address"));

      // prepare the list of accounts and networks to approve
      const namespaces = buildApprovedNamespaces({
        proposal: proposal.params,
        supportedNamespaces: {
          tezos: {
            chains: [network],
            methods: ["tezos_getAccounts", "tezos_sign", "tezos_send"],
            events: [],
            accounts: [`${network}:${account.address.pkh}`],
          },
        },
      });

      const session: SessionTypes.Struct = await walletKit.approveSession({
        id: proposal.id,
        namespaces,
        sessionProperties: {},
      });
      console.log("WC session approved", session);
      onClose();
    });

  const onReject = () =>
    handleAsyncAction(async () => {
      // close immediately assuming that the user wants to get rid of the modal
      onClose();
      await walletKit.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
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
              <HStack color={color("500")}>
                <Icon as={CloseIcon} />
                <Card marginLeft="8px">Move funds without permission</Card>
              </HStack>
            </VStack>

            <Box marginTop="8px">
              <FormControl marginTop="24px" isInvalid={!!errors.address}>
                <OwnedImplicitAccountsAutocomplete
                  allowUnknown={false}
                  inputName="address"
                  label="Select Account"
                />
                {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
              </FormControl>
              <Text marginTop="16px" color={color("500")}>
                Network:
              </Text>
              <Text marginLeft="8px">{network}</Text>
            </Box>
            <Divider />
            <VerifyInfobox />
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button width="100%" isDisabled={isLoading} onClick={onReject} size="lg">
            Reject
          </Button>
          <Button
            width="100%"
            isDisabled={!isValid}
            isLoading={isLoading}
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
