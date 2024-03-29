import { Box, Center, Flex, Text } from "@chakra-ui/react";

import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useIsOutgoingOperation } from "./useIsOutgoingOperation";
import { useShowAddress } from "./useShowAddress";
import colors from "../../style/colors";
import { parsePkh } from "../../types/Address";
import { prettyTezAmount } from "../../utils/format";
import { TransactionOperation } from "../../utils/tezos";
import { AddressPill } from "../AddressPill/AddressPill";

export const TransactionTile: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const isOutgoing = useIsOutgoingOperation(operation.sender.address);
  const amount = prettyTezAmount(String(operation.amount));
  const showToAddress = useShowAddress(operation.target.address);
  const showFromAddress = useShowAddress(operation.sender.address);
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  const titleColor = isOutgoing ? colors.orange : colors.green;
  const sign = isOutgoing ? "-" : "+";

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-transaction">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <TransactionDirectionIcon marginRight="8px" isOutgoing={isOutgoing} />
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
            {(showToAddress || showAnyAddress) && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={parsePkh(operation.target.address)} />
              </Flex>
            )}
            {showFromAddress && (
              <Flex data-testid="from">
                <Text marginRight="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
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
