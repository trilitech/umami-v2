import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import BakerIcon from "../../assets/icons/Baker";
import colors from "../../style/colors";
import { useShowAddress } from "./useShowAddress";
import { DelegationOperation } from "../../utils/tezos";
import { TzktLink } from "./TzktLink";
import { Fee } from "./Fee";
import { Timestamp } from "./Timestamp";
import AddressPill from "../AddressPill/AddressPill";
import { TzktAlias } from "../../types/Address";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { OperationStatus } from "./OperationStatus";

export const DelegationTile: React.FC<{ operation: DelegationOperation }> = ({ operation }) => {
  const isDelegating = !!operation.newDelegate;
  const operationType = isDelegating ? "Delegate" : "Delegation Ended";
  const showFromAddress = useShowAddress(operation.sender.address);

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-delegation">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <BakerIcon stroke={colors.gray[450]} mr="8px" />
          <TzktLink data-testid="title" hash={operation.hash} counter={operation.counter} mr="8px">
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
