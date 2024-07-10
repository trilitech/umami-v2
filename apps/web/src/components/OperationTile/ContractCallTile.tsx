import { Box, Center, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { type TransactionOperation } from "@umami/tzkt";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { ContractIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const ContractCallTile = ({ operation }: { operation: TransactionOperation }) => {
  const color = useColor();

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-contract-call">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <Icon as={ContractIcon} marginRight="8px" />
          <InternalPrefix operation={operation} />
          <TzktLink
            marginRight="8px"
            counter={operation.counter}
            data-testid="title"
            hash={operation.hash}
          >
            <Heading size="md">Contract Call: {operation.parameter?.entrypoint}</Heading>
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
                <AddressPill address={operation.target} />
              </Flex>
            )}
            <Flex data-testid="from">
              <Text marginRight="6px" color={color("gray.450")}>
                From:
              </Text>
              <AddressPill address={operation.sender} />
            </Flex>
          </Flex>
          <Center>
            <OperationTypeWrapper>Contract Call</OperationTypeWrapper>
            <OperationStatus {...operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
