import {
  AirGapTransactionStatus,
  IAirGapTransaction,
} from "@airgap/coinlib-core/interfaces/IAirGapTransaction";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import colors from "../style/colors";
import { formatPkh } from "../utils/format";

import { formatRelative } from "date-fns";

const lightColor = "umami.gray.200";
const darkColor = "umami.gray.500";

const renderFromTo = (from: string, to: string) => {
  return (
    <Flex>
      <Text color={darkColor} mr={2}>
        Sent to:{" "}
      </Text>
      <Text color={lightColor}>{to}</Text>
      <Text color={darkColor} mr={2} ml={2}>
        From:{" "}
      </Text>
      <Text color={lightColor}>{from}</Text>
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
        mt={3} // hacky
        mr={2}
        w={4}
        h={4}
        as={isInbound ? BsArrowDownLeft : BsArrowUpRight}
      />

      <Box flex={1}>
        <Flex justifyContent={"space-between"}>
          <Text fontWeight={600}>{amount}</Text>
          <Text color={darkColor}>{relativeTime}</Text>
        </Flex>
        <Flex justifyContent={"space-between"}>
          {renderFromTo(from, to)}
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
