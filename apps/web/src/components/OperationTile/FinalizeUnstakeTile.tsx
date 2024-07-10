import { Box, Center, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { parsePkh, prettyTezAmount } from "@umami/tezos";
import { type FinalizeUnstakeOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const FinalizeUnstakeTile = memo(
  ({ operation }: { operation: FinalizeUnstakeOperation }) => {
    const color = useColor();
    const amount = prettyTezAmount(String(operation.amount));

    return (
      <Flex flexDirection="column" width="100%" data-testid="operation-tile-finalize-unstake">
        <Flex justifyContent="space-between" marginBottom="10px">
          <Center>
            <Icon as={DelegateIcon} marginRight="8px" />
            <InternalPrefix operation={operation} />
            <TzktLink
              marginRight="8px"
              counter={operation.counter}
              data-testid="title"
              hash={operation.hash}
            >
              <Center gap="4px">
                <Heading size="md">Finalize Unstake:</Heading>
                <Text>{amount}</Text>
              </Center>
            </TzktLink>
            <Fee operation={operation} />
          </Center>
          <Flex alignSelf="flex-end">
            <Timestamp timestamp={operation.timestamp} />
          </Flex>
        </Flex>
        <Box>
          <Flex justifyContent="space-between">
            <Flex gap="6px" data-testid="to">
              <Text color={color("gray.450")}>To:</Text>
              <AddressPill address={parsePkh(operation.sender.address)} />
            </Flex>
            <Center>
              <OperationTypeWrapper>Finalize Unstake</OperationTypeWrapper>
              <OperationStatus {...operation} />
            </Center>
          </Flex>
        </Box>
      </Flex>
    );
  }
);
