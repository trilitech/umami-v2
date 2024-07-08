import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { parsePkh, prettyTezAmount } from "@umami/tezos";
import { type StakeOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { BakerIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { AddressPill } from "../AddressPill/AddressPill";

export const StakeTile = memo(({ operation }: { operation: StakeOperation }) => {
  const amount = prettyTezAmount(String(operation.amount));

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-stake">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <BakerIcon marginRight="8px" />
          <InternalPrefix operation={operation} />
          <TzktLink
            marginRight="8px"
            counter={operation.counter}
            data-testid="title"
            hash={operation.hash}
          >
            <Center gap="4px">
              <Heading size="md">Stake:</Heading>
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
          <Flex gap="15px">
            <Flex gap="6px" data-testid="to">
              <Text color={colors.gray[450]}>To:</Text>
              <AddressPill address={parsePkh(operation.baker.address)} />
            </Flex>

            <Flex gap="6px" data-testid="from">
              <Text color={colors.gray[450]}>From:</Text>
              <AddressPill address={parsePkh(operation.sender.address)} />
            </Flex>
          </Flex>
          <Center>
            <OperationTypeWrapper>Stake</OperationTypeWrapper>
            <OperationStatus {...operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
});
