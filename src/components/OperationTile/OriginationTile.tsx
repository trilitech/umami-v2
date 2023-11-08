import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { CODE_HASH, TYPE_HASH } from "../../utils/multisig/fetch";
import { OriginationOperation } from "../../utils/tezos";
import { useShowAddress } from "./useShowAddress";
import ContractIcon from "../../assets/icons/Contract";
import { TzktLink } from "./TzktLink";
import { Fee } from "./Fee";
import { Timestamp } from "./Timestamp";
import AddressPill from "../AddressPill/AddressPill";
import colors from "../../style/colors";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { OperationStatus } from "./OperationStatus";

export const OriginationTile: React.FC<{ operation: OriginationOperation }> = ({ operation }) => {
  const isMultisig =
    operation.originatedContract?.codeHash === CODE_HASH &&
    operation.originatedContract.typeHash === TYPE_HASH;

  const contractTitle = isMultisig ? "Multisig Account Created" : "Contract Origination";

  const showFromAddress = useShowAddress(operation.sender.address);

  return (
    <Flex direction="column" data-testid="operation-tile-origination" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <ContractIcon mr="8px" />
          <TzktLink data-testid="title" transactionId={operation.id} mr="8px">
            <Heading size="md">{contractTitle}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex data-testid="from">
            {!showFromAddress ? (
              <Text color={colors.gray[450]}>N/A</Text>
            ) : (
              <Flex mr="15px">
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </Flex>
            )}
          </Flex>
          <Center>
            <OperationTypeWrapper>Contract Origination</OperationTypeWrapper>
            <OperationStatus {...operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
