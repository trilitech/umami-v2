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
import {
  WcScenarioType,
  useAsyncActionHandler,
  useGetImplicitAccount,
  useToggleWcPeerListUpdated,
  useValidateWcRequest,
  walletKit,
} from "@umami/state";
import { WalletConnectError, WcErrorCode } from "@umami/utils";
import { type SessionTypes, type Verify } from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { FormProvider, useForm } from "react-hook-form";

import { AlertTriangleIcon, CheckmarkIcon, CloseIcon } from "../../assets/icons";
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
  const toggleWcPeerListUpdated = useToggleWcPeerListUpdated();
  const validateWcRequest = useValidateWcRequest();
  const color = useColor();

  const { goBack } = useDynamicModalContext();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const verifyContext: Verify.Context = proposal.verifyContext;
  const isScam = verifyContext.verified.isScam;
  const validationStatus = verifyContext.verified.validation;

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
      validateWcRequest("session proposal", proposal.id, WcScenarioType.APPROVE, goBack);
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

      goBack();
      try {
        const session: SessionTypes.Struct = await walletKit.approveSession({
          id: proposal.id,
          namespaces,
          sessionProperties: {},
        });
        console.log("WC session approved", session);
        toggleWcPeerListUpdated();
      } catch (error: any) {
        throw new WalletConnectError(
          "Failed to approve the session. Check the connection at dApp side and try again.",
          WcErrorCode.SESSION_NOT_FOUND,
          null,
          error?.message
        );
      }
    });

  const onReject = () =>
    handleAsyncAction(async () => {
      // Close immediately assuming that the user wants to get rid of the modal
      goBack();

      console.log("WC session rejected");
      if (validateWcRequest("session proposal", proposal.id, WcScenarioType.REJECT, goBack)) {
        await walletKit.rejectSession({
          id: proposal.id,
          reason: getSdkError("USER_REJECTED_METHODS"),
        });
      }
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <ModalBody>
          <Card>
            <ProjectInfoCard metadata={proposal.params.proposer.metadata} />
            <VStack margin="auto" spacing="16px">
              <HStack
                margin="auto"
                padding="8px"
                border="1px solid"
                borderColor="yellow.500"
                borderRadius="md"
              >
                <Icon as={AlertTriangleIcon} verticalAlign="bottom" />
                <Card marginLeft="8px">Beta version. Use with caution.</Card>
              </HStack>
            </VStack>
            <VerifyInfobox isScam={isScam} validationStatus={validationStatus} />
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
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button width="100%" isDisabled={isLoading} onClick={onReject} size="lg">
            Reject
          </Button>
          <Button
            width="100%"
            isDisabled={!isValid || isScam}
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
