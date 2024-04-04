import {
  Box,
  Center,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";

import { SlashIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { LedgerAccount, MnemonicAccount } from "../../../types/Account";
import { CircleIcon } from "../../CircleIcon";

/**
 * Shows account's derivation information
 *
 * @param account -
 */
export const InfoModal: React.FC<{ account: LedgerAccount | MnemonicAccount }> = ({ account }) => {
  const values = [
    {
      title: "Template",
      content: account.derivationPathTemplate,
    },
    {
      title: "Path",
      content: account.derivationPath,
    },
    {
      title: "Type (Curve)",
      content: account.curve,
    },
  ];

  return (
    <ModalContent>
      <ModalHeader>
        <CircleIcon icon={<SlashIcon />} size="48px" />
        <Center marginBottom="8px">
          <Heading marginTop="16px">Derivation Info</Heading>
        </Center>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        {values.map(({ title, content }) => {
          if (!content) {
            return null;
          }
          return (
            <Box key={content} marginTop="24px">
              <Heading size="md">{title}</Heading>
              <Center
                justifyContent="flex-start"
                marginTop="12px"
                padding="15px"
                borderRadius="4px"
                backgroundColor={colors.gray[800]}
              >
                <Text size="sm">{content}</Text>
              </Center>
            </Box>
          );
        })}
      </ModalBody>
    </ModalContent>
  );
};
