import { AirGapTransactionStatus } from "@airgap/coinlib-core/interfaces/IAirGapTransaction";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import colors from "../style/colors";

import { OperationDisplay } from "../types/Operation";
import { getIsInbound } from "../views/operations/operationsUtils";
import { CopyableAddress } from "./CopyableText";

const darkColor = "umami.gray.500";

const renderFromTo = (address: string, isInbound: boolean) => {
  return (
    <Flex alignItems="center">
      <Heading color="text.dark" size="sm" mr={2}>
        {`${isInbound ? "From:" : "Sent to:"} `}
      </Heading>
      <CopyableAddress pkh={address} />
    </Flex>
  );
};

export const OperationTile: React.FC<{
  operation: OperationDisplay;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ operation, onClick = () => {} }) => {
  const { amount, status, prettyTimestamp, sender, recipient } = operation;
  const success = status === AirGapTransactionStatus.APPLIED;
  // TODO refactor this
  const isInbound = getIsInbound(amount.prettyDisplay);

  return (
    <Flex
      h={16}
      cursor="pointer"
      mr={4}
      ml={4}
      borderBottom={`1px solid ${colors.gray[800]}`}
      alignItems="center"
    >
      <Icon
        alignSelf="flex-start"
        color={darkColor}
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
          {renderFromTo(isInbound ? sender : recipient, isInbound)}
          {success && (
            //TODO handle pending and failed
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
