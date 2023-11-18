import { Box, Flex, ModalBody, ModalContent, ModalFooter, Heading } from "@chakra-ui/react";
import { FC } from "react";
import { QRCode } from "react-qrcode-logo";
import AddressPill from "./AddressPill/AddressPill";
import { parsePkh } from "../types/Address";
import { useGetOwnedAccountSafe } from "../utils/hooks/getAccountDataHooks";
import FormPageHeader from "./SendFlow/FormPageHeader";

export const ReceiveModal: FC<{
  pkh: string;
}> = ({ pkh }) => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  return (
    <ModalContent>
      <FormPageHeader
        title="Receive"
        subTitle="You can receive tez or other digital assets by scanning or sharing this QR code"
      />
      <ModalBody>
        <Flex alignItems="center" direction="column" justifyContent="space-between">
          <Box borderRadius="8px" bg="white" p="8px">
            <QRCode value={pkh} size={232} />
          </Box>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Box w="100%">
          {account && (
            <Heading textAlign="center" marginY={2}>
              {account.label}
            </Heading>
          )}
          <Flex justifyContent="center" w="100%">
            <AddressPill address={parsePkh(pkh)} mode={{ type: "no_icons" }} />
          </Flex>
        </Box>
      </ModalFooter>
    </ModalContent>
  );
};

export default ReceiveModal;
