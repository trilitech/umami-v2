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
} from "@chakra-ui/react";
import { FC } from "react";
import colors from "../style/colors";
import { CopyableAddress } from "./CopyableText";
import { QRCode } from "react-qrcode-logo";
const ReceiveModal: FC<{
  pkh: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pkh, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={colors.gray[900]}>
        <ModalHeader textAlign={"center"}>Receive</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            direction="column"
            justifyContent="space-between"
          >
            <Text size="sm" color={colors.gray[400]} textAlign="center">
              You can receive tez or other digital assets by scanning or sharing
              this QR code
            </Text>
            <Box mt={5}>
              <QRCode
                value={pkh}
                size={400}
                qrStyle="dots"
                fgColor={colors.orange}
                bgColor={colors.gray[900]}
                logoImage={process.env.PUBLIC_URL + "icon.png"}
              />
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="100%">
            <CopyableAddress pkh={pkh} />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReceiveModal;
