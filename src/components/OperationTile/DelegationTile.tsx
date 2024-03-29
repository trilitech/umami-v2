import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";

import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { useShowAddress } from "./useShowAddress";
import { BakerIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { TzktAlias } from "../../types/Address";
import { DelegationOperation } from "../../utils/tezos";
import { AddressPill } from "../AddressPill/AddressPill";

export const DelegationTile: React.FC<{ operation: DelegationOperation }> = ({ operation }) => {
  const isDelegating = !!operation.newDelegate;
  const operationType = isDelegating ? "Delegate" : "Delegation Ended";
  const showFromAddress = useShowAddress(operation.sender.address);

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-delegation">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <BakerIcon marginRight="8px" />
          <TzktLink
            marginRight="8px"
            counter={operation.counter}
            data-testid="title"
            hash={operation.hash}
          >
            <Heading size="md">{operationType}</Heading>
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
            {isDelegating && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={operation.newDelegate as TzktAlias} />
              </Flex>
            )}
            {showFromAddress && (
              <Flex data-testid="from">
                <Text marginRight="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </Flex>
            )}
            {!isDelegating && !showFromAddress && <Text color={colors.gray[450]}>N/A</Text>}
          </Flex>
          <Center>
            <OperationTypeWrapper>{operationType}</OperationTypeWrapper>
            <OperationStatus {...operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
