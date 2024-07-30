import {
  Box,
  Button,
  Heading,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { type Account } from "@umami/core";
import { QRCode } from "react-qrcode-logo";

import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../ModalCloseButton";

type AccountInfoModalProps = {
  account: Account;
};

export const AccountInfoModal = ({ account }: AccountInfoModalProps) => {
  const color = useColor();
  const { onOpen, isOpen } = useDisclosure();

  const handleCopyAddress = () => navigator.clipboard.writeText(account.address.pkh);

  return (
    <ModalContent>
      <ModalHeader>
        <VStack gap="12px">
          <Heading size="md">Account Info</Heading>
          <Text maxWidth="340px" color={color("700")} fontWeight="400" size="md">
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
            borderWidth="1.5px"
            borderColor={color("100")}
            borderRadius="30px"
          >
            <QRCode size={180} value={account.address.pkh} />
          </Box>
          <Box>
            <Heading color={color("900")} textAlign="center" size="sm">
              {account.label}
            </Heading>
            <Text color={color("700")} size="md">
              {account.address.pkh}
            </Text>
          </Box>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Popover isOpen={isOpen} onOpen={onOpen}>
          <PopoverTrigger>
            <Button width="full" onClick={handleCopyAddress} size="lg" variant="primary">
              Copy Wallet Address
            </Button>
          </PopoverTrigger>
          <PopoverContent maxWidth="max-content" background="white">
            <PopoverArrow background="white !important" />
            <PopoverBody>
              <Text color={color("black")} size="sm">
                Copied!
              </Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </ModalFooter>
    </ModalContent>
  );
};
