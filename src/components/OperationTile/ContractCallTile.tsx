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
    <Flex direction="column" data-testid="operation-tile-contract-call" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <ContractIcon mr="8px" />
          <TzktLink operation={operation} data-testid="title" mr="8px">
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
              <Flex mr="15px" data-testid="to">
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={operation.target} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex data-testid="from">
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </Flex>
            )}
          </Flex>
          <Center>
            <OperationTypeWrapper>Contract Call</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
