import {
  Box,
  Button,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicDisclosureContext } from "@umami/components";
import { type Account } from "@umami/core";
import { type MouseEvent } from "react";
import { QRCode } from "react-qrcode-logo";

import { ModalCloseButton } from "../ModalCloseButton";

type AccountInfoModalProps = {
  account: Account;
};

export const AccountInfoModal = ({ account }: AccountInfoModalProps) => {
  const { onClose } = useDynamicDisclosureContext();

  const handleCopyAddress = async (event: MouseEvent<HTMLButtonElement>) => {
    await navigator.clipboard.writeText(account.address.pkh);
    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>
        <VStack gap="12px">
          <Heading size="md">Account Info</Heading>
          <Text maxWidth="340px" color="gray.700" fontWeight="400" size="md">
            You can receive tez or other digital assets by scanning or sharing this QR code
          </Text>
        </VStack>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VStack gap="30px">
          <Box
            padding="30px"
            background="white"
            borderWidth={1.5}
            borderColor="gray.100"
            borderRadius="30px"
          >
            <QRCode size={180} value={account.address.pkh} />
          </Box>
          <Box>
            <Heading color="gray.900" textAlign="center" size="sm">
              {account.label}
            </Heading>
            <Text color="gray.700" fontWeight="400" size="md">
              {account.address.pkh}
            </Text>
          </Box>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button width="full" onClick={handleCopyAddress} size="lg" variant="primary">
          Copy Wallet Address
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
