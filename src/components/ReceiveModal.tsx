import { Box, Flex, Heading, ModalBody, ModalContent, ModalFooter } from "@chakra-ui/react";
import { FC } from "react";
import { QRCode } from "react-qrcode-logo";

import { AddressPill } from "./AddressPill/AddressPill";
import { FormPageHeader } from "./SendFlow/FormPageHeader";
import { parsePkh } from "../types/Address";
import { useGetOwnedAccountSafe } from "../utils/hooks/getAccountDataHooks";

export const ReceiveModal: FC<{
  pkh: string;
}> = ({ pkh }) => {
  const getOwnedAccount = useGetOwnedAccountSafe();
  const account = getOwnedAccount(pkh);
  return (
    <ModalContent>
      <FormPageHeader
        subTitle="You can receive tez or other digital assets by scanning or sharing this QR code"
        title="Receive"
      />
      <ModalBody>
        <Flex alignItems="center" justifyContent="space-between" flexDirection="column">
          <Box padding="8px" background="white" borderRadius="8px">
            <QRCode size={232} value={pkh} />
          </Box>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Box width="100%">
          {account && (
            <Heading textAlign="center" marginY={2}>
              {account.label}
            </Heading>
          )}
          <Flex justifyContent="center" width="100%">
            <AddressPill address={parsePkh(pkh)} mode={{ type: "no_icons" }} />
          </Flex>
        </Box>
      </ModalFooter>
    </ModalContent>
  );
};
