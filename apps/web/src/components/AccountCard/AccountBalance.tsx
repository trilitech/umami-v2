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
import { useCurrentAccount, useGetAccountBalance, useGetDollarBalance } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { useContext } from "react";

import { ArrowDownLeftIcon, PlusIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { SendButton } from "../SendButton";

export const AccountBalance = () => {
  const color = useColor();
  const { openWith, isOpen } = useContext(DynamicModalContext);
  const currentAccount = useCurrentAccount()!;
  const balance = useGetAccountBalance()(currentAccount.address.pkh);
  const usdBalance = useGetDollarBalance()(currentAccount.address.pkh);

  return (
    <Box paddingX="12px">
      <Flex flexDirection="column" gap="4px">
        <Text
          display={{
            base: "none",
            lg: "block",
          }}
          color={color("600")}
          fontWeight="600"
          size="sm"
        >
          Tez Balance
        </Text>
        <Text color={color("900")} fontWeight="600" size="2xl">
          {balance && prettyTezAmount(balance)}
        </Text>
        <Text color={color("700")} size="sm">
          {usdBalance && `${usdBalance}$`}
        </Text>
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
