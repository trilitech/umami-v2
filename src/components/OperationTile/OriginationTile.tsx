import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { CODE_HASH, TYPE_HASH } from "../../utils/multisig/fetch";
import { OriginationOperation } from "../../utils/tezos";
import { useShowAddress } from "./useShowAddress";
import { ContractIcon } from "../../assets/icons";
import { TzktLink } from "./TzktLink";
import { Fee } from "./Fee";
import { Timestamp } from "./Timestamp";
import { AddressPill } from "../AddressPill/AddressPill";
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
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-origination">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <ContractIcon marginRight="8px" />
          <TzktLink
            marginRight="8px"
            counter={operation.counter}
            data-testid="title"
            hash={operation.hash}
          >
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
              <Flex marginRight="15px">
                <Text marginRight="6px" color={colors.gray[450]}>
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
