import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { ContractIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { TransactionOperation } from "../../utils/tezos";
import { AddressPill } from "../AddressPill/AddressPill";

export const ContractCallTile: React.FC<{
  operation: TransactionOperation;
}> = ({ operation }) => (
  <Flex flexDirection="column" width="100%" data-testid="operation-tile-contract-call">
    <Flex justifyContent="space-between" marginBottom="10px">
      <Center>
        <ContractIcon marginRight="8px" />
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
              <Text marginRight="6px" color={colors.gray[450]}>
                To:
              </Text>
              <AddressPill address={operation.target} />
            </Flex>
          )}
          <Flex data-testid="from">
            <Text marginRight="6px" color={colors.gray[450]}>
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
