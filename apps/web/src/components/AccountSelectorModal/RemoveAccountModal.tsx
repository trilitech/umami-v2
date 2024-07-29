import {
  Button,
  Flex,
  Heading,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicDisclosureContext } from "@umami/components";
import { type LedgerAccount, type SecretKeyAccount, type SocialAccount } from "@umami/core";
import { useImplicitAccounts, useRemoveAccount } from "@umami/state";
import { useNavigate } from "react-router";

import { AlertIcon } from "../../assets/icons";
import { ModalCloseButton } from "../ModalCloseButton";

type RemoveAccountModalProps = {
  account: SocialAccount | LedgerAccount | SecretKeyAccount;
};

export const RemoveAccountModal = ({ account }: RemoveAccountModalProps) => {
  const { goBack, onClose } = useDynamicDisclosureContext();
  const removeAccount = useRemoveAccount();
  const navigate = useNavigate();

  const isLastImplicitAccount = useImplicitAccounts().length === 1;

  const handleRemoveAccount = () => {
    removeAccount(account);

    if (isLastImplicitAccount) {
      onClose();
      navigate("/");
    } else {
      goBack();
    }
  };

  let description =
    "Are you sure you want to hide this account? You will need to manually import it again.";
  let buttonLabel = "Remove";

  if (isLastImplicitAccount) {
    description =
      "Removing your last account will off-board you from Umami. " +
      "This will remove or reset all customized settings to their defaults. " +
      "Personal data (including saved contacts, password and accounts) won't be affected.";
    buttonLabel = "Remove & Off-board";
  }

  return (
    <ModalContent>
      <ModalHeader>
        <Flex alignItems="center" justifyContent="center" flexDirection="column">
          <AlertIcon width="24px" />
          <Heading marginTop="18px" marginBottom="12px" size="md">
            Remove Account
          </Heading>
          <Text maxWidth="340px" color="gray.700" fontWeight="400" size="md">
            {description}
          </Text>
        </Flex>
        <ModalCloseButton />
      </ModalHeader>
      <ModalFooter>
        <Button width="full" onClick={handleRemoveAccount} size="lg" variant="alert">
          {buttonLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
