import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import colors from "../style/colors";
import { useIsBlockFinalised } from "../utils/hooks/assetsHooks";
import { OperationDisplay } from "../types/Transfer";
import { getIsInbound } from "../views/operations/operationsUtils";
import AddressPill from "./AddressPill/AddressPill";

export const OperationTile: React.FC<{
  operation: OperationDisplay;
}> = ({ operation }) => {
  const isBlockFinalised = useIsBlockFinalised();
  const { amount, prettyTimestamp, sender, recipient } = operation;
  const success = isBlockFinalised(operation.level);
  // TODO refactor this
  const isInbound = getIsInbound(amount.prettyDisplay);

  return (
    <Flex
      h={16}
      borderBottom={`1px solid ${colors.gray[800]}`}
      alignItems="center"
      data-testid="operation-tile"
    >
      <Icon
        alignSelf="flex-start"
        color="umami.gray.500"
        mt={4}
        mr={4}
        w={4}
        h={4}
        as={isInbound ? BsArrowUpRight : BsArrowDownLeft}
      />

      <Box flex={1}>
        <Flex justifyContent="space-between">
          <Heading size="sm">{amount.prettyDisplay}</Heading>
          <Text size="sm" color="text.dark">
            {prettyTimestamp}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Flex alignItems="center" mr="5px">
              <Heading color="text.dark" size="sm" mr={2}>
                Sent to:
              </Heading>
              <AddressPill address={recipient} />
            </Flex>
            <Flex alignItems="center">
              <Heading color="text.dark" size="sm" mr={2}>
                From:
              </Heading>
              <AddressPill address={sender} />
            </Flex>
          </Flex>
          {success && (
            //TODO handle pending and failed https://app.asana.com/0/1204165186238194/1204849210925962/f
            <Icon
              alignSelf="flex-end"
              color="umami.green"
              cursor="pointer"
              w={4}
              h={4}
              as={AiOutlineCheckCircle}
            />
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
