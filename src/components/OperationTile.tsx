import {
  AirGapTransactionStatus,
  IAirGapTransaction,
} from "@airgap/coinlib-core/interfaces/IAirGapTransaction";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import colors from "../style/colors";
import { formatPkh } from "../utils/format";

import { formatRelative } from "date-fns";

const darkColor = "umami.gray.500";

const renderFromTo = (address: string, isInbound: boolean) => {
  return (
    <Flex>
      <Heading color={"text.dark"} size="sm" mr={2}>
        {`${isInbound ? "From:" : "Sent to:"} `}
      </Heading>
      <Heading color={"text.dark"} size="sm">
        {address}
      </Heading>
    </Flex>
  );
};

export const OperationTile: React.FC<{
  operation: Omit<IAirGapTransaction, "network" | "protocolIdentifier">;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ operation, onClick = () => {} }) => {
  const { amount, isInbound, status, timestamp } = operation;
  const from = formatPkh(operation.from[0]);
  const to = formatPkh(operation.to[0]);
  const success = status === AirGapTransactionStatus.APPLIED;

  const now = new Date();

  const relativeTime =
    timestamp && formatRelative(new Date(timestamp * 1000), now);
  return (
    <Flex
      h={16}
      cursor="pointer"
      mr={4}
      ml={4}
      borderBottom={`1px solid ${colors.gray[800]}`}
      alignItems={"center"}
    >
      <Icon
        alignSelf={"flex-start"}
        color={darkColor}
        mt={4}
        mr={4}
        w={4}
        h={4}
        as={isInbound ? BsArrowUpRight : BsArrowDownLeft}
      />

      <Box flex={1}>
        <Flex justifyContent={"space-between"}>
          <Heading size="sm">{amount}</Heading>
          <Text size="sm" color="text.dark">
            {relativeTime}
          </Text>
        </Flex>
        <Flex justifyContent={"space-between"}>
          {renderFromTo(isInbound ? from : to, isInbound)}
          {success && (
            //TODO handle pending and failed
            <Icon
              alignSelf={"flex-end"}
              color={"umami.green"}
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
