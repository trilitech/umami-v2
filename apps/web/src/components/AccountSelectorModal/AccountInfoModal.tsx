import {
  Box,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { type Account } from "@umami/core";
import { QRCode } from "react-qrcode-logo";

import { CopyIcon } from "../../assets/icons";
import { light } from "../../styles/colors";
import { useColor } from "../../styles/useColor";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";
import { CopyButton } from "../CopyButton/CopyButton";

type AccountInfoModalProps = {
  account: Account;
};

export const AccountInfoModal = ({ account }: AccountInfoModalProps) => {
  const color = useColor();

  return (
    <ModalContent>
      <ModalHeader>
        <VStack gap="12px">
          <Heading size="xl">Account Info</Heading>
          <Text maxWidth="340px" color={color("700")} fontWeight="400" size="md">
            You can receive tez or other digital assets by scanning or sharing this QR code
          </Text>
        </VStack>
        <ModalBackButton />
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VStack gap="30px">
          <Box
            padding="30px"
            background={light.grey.white}
            borderWidth="1.5px"
            borderColor={color("100")}
            borderRadius="30px"
          >
            <QRCode size={180} value={account.address.pkh} />
          </Box>
          <Box>
            <Heading color={color("900")} textAlign="center" size="md">
              {account.label}
            </Heading>
            <Text color={color("700")} size="sm">
              {account.address.pkh}
            </Text>
          </Box>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <CopyButton
          width="full"
          fontWeight="600"
          size="lg"
          value={account.address.pkh}
          variant="primary"
        >
          <Icon as={CopyIcon} />
          <Text>Copy Wallet Address</Text>
        </CopyButton>
      </ModalFooter>
    </ModalContent>
  );
};
