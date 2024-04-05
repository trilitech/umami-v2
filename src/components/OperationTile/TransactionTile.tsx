import { Box, Center, Flex, Text } from "@chakra-ui/react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import {
  operationColor,
  operationSign,
  useGetOperationDestination,
} from "./useGetOperationDestination";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { prettyTezAmount } from "../../utils/format";
import { TransactionOperation } from "../../utils/tezos";
import { AddressPill } from "../AddressPill/AddressPill";

export const TransactionTile: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const operationDestination = useGetOperationDestination(
    operation.sender.address,
    operation.target?.address
  );
  const amount = prettyTezAmount(String(operation.amount));

  const titleColor = operationColor(operationDestination);
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
                <Text marginRight="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={parsePkh(operation.target.address)} />
              </Flex>
            )}

            <Flex data-testid="from">
              <Text marginRight="6px" color={colors.gray[450]}>
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
