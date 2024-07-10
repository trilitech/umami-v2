import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { operationSign } from "@umami/core";
import { useGetOperationDestination } from "@umami/state";
import { parsePkh, prettyTezAmount } from "@umami/tezos";
import { type TransactionOperation } from "@umami/tzkt";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { useOperationColor } from "./operationColor";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const TransactionTile = ({ operation }: { operation: TransactionOperation }) => {
  const color = useColor();
  const operationDestination = useGetOperationDestination(
    operation.sender.address,
    operation.target?.address
  );
  const amount = prettyTezAmount(String(operation.amount));

  const titleColor = useOperationColor(operationDestination);
  const sign = operationSign(operationDestination);

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-transaction">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <TransactionDirectionIcon marginRight="8px" destination={operationDestination} />
          <InternalPrefix operation={operation} />
          <TzktLink
            marginRight="8px"
            color={titleColor}
            counter={operation.counter}
            data-testid="title"
            hash={operation.hash}
          >
            <Text color={titleColor} fontWeight="600">
              {sign} {amount}
            </Text>
          </TzktLink>
          <Fee operation={operation} />
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {operation.target && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={color("gray.450")}>
                  To:
                </Text>
                <AddressPill address={parsePkh(operation.target.address)} />
              </Flex>
            )}

            <Flex data-testid="from">
              <Text marginRight="6px" color={color("gray.450")}>
                From:
              </Text>
              <AddressPill address={parsePkh(operation.sender.address)} />
            </Flex>
          </Flex>
          <Center>
            <OperationTypeWrapper>Transaction</OperationTypeWrapper>
            <OperationStatus {...operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
