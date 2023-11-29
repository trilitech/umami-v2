import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { TransactionOperation } from "../../utils/tezos";
import { useShowAddress } from "./useShowAddress";
import ContractIcon from "../../assets/icons/Contract";
import { TzktLink } from "./TzktLink";
import { Fee } from "./Fee";
import { Timestamp } from "./Timestamp";
import AddressPill from "../AddressPill/AddressPill";
import colors from "../../style/colors";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { OperationStatus } from "./OperationStatus";

export const ContractCallTile: React.FC<{
  operation: TransactionOperation;
}> = ({ operation }) => {
  const showToAddress = useShowAddress(operation.target.address);
  const showFromAddress = useShowAddress(operation.sender.address);
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  return (
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
            {showToAddress && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={operation.target} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex data-testid="from">
                <Text marginRight="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </Flex>
            )}
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
