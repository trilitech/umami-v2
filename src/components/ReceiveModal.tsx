import {
  Box,
  Text,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useRef } from "react";
import colors from "../style/colors";
import { QRCode } from "react-qrcode-logo";
import AddressPill from "./AddressPill/AddressPill";
import { parsePkh } from "../types/Address";

type Options = {
  pkh: string;
};

export const useReceiveModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const optionsRef = useRef<Options>();
  const options = optionsRef.current;

  return {
    modalElement: (
      <>{options?.pkh && <ReceiveModal pkh={options?.pkh} isOpen={isOpen} onClose={onClose} />}</>
    ),
    onOpen: (options: Options) => {
      optionsRef.current = options;
      onOpen();
    },
  };
};

const ReceiveModal: FC<{
  pkh: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pkh, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colors.gray[900]} p={3}>
        <ModalHeader textAlign="center">Receive</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" direction="column" justifyContent="space-between">
            <Text size="sm" color={colors.gray[400]} textAlign="center">
              You can receive tez or other digital assets by scanning or sharing this QR code
            </Text>
            <Box mt={5}>
              <QRCode
                value={pkh}
                size={400}
                logoPadding={7}
                qrStyle="dots"
                fgColor={colors.orange}
                bgColor={colors.gray[900]}
                logoImage="icon.png"
              />
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="100%">
            <AddressPill address={parsePkh(pkh)} />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveModal;
