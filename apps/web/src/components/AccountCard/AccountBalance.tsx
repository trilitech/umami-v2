import {
  Box,
  Flex,
  Icon,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { useContext } from "react";

import { ArrowDownLeftIcon, PlusIcon } from "../../assets/icons";
import { SendButton } from "../SendButton";

export const AccountBalance = () => {
  const { openWith, isOpen } = useContext(DynamicModalContext);

  return (
    <Box paddingX="12px">
      <Flex flexDirection="column" gap="4px">
        <Text
          display={{
            base: "none",
            lg: "block",
          }}
          fontWeight="600"
          size="sm"
        >
          Tez Balance
        </Text>
        <Text size="2xl" variant="bold">
          2882.675746 ꜩ
        </Text>
        <Text size="sm">$3603.34</Text>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginTop={{ base: "20px", lg: "40px" }}
      >
        <IconButton
          aria-label="Deposit"
          icon={<Icon as={PlusIcon} width="24px" height="24px" />}
          isRound
          size="lg"
          variant="iconButtonSolid"
        />
        <IconButton
          marginRight="12px"
          marginLeft="auto"
          borderRadius="full"
          aria-label="Send"
          icon={<ArrowDownLeftIcon />}
          size="lg"
          variant="iconButtonOutline"
        />
        <SendButton
          padding={{ base: "10px 24px", lg: "10px 40px" }}
          borderRadius="full"
          onClick={() =>
            openWith(
              <ModalContent>
                <ModalHeader>
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                  <Text>Not supported yet :(</Text>
                </ModalBody>
              </ModalContent>
            )
          }
          size="lg"
          variant="primary"
        >
          Send {isOpen}
        </SendButton>
      </Flex>
    </Box>
  );
};
