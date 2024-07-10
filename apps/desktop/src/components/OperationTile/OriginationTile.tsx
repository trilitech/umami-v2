import { Box, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { CODE_HASH, TYPE_HASH } from "@umami/multisig";
import { type OriginationOperation } from "@umami/tzkt";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { ContractIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { AddressPill } from "../AddressPill/AddressPill";

export const OriginationTile = ({ operation }: { operation: OriginationOperation }) => {
  const isMultisig =
    operation.originatedContract?.codeHash === CODE_HASH &&
    operation.originatedContract.typeHash === TYPE_HASH;

  const contractTitle = isMultisig ? "Multisig Account Created" : "Contract Origination";

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-origination">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <ContractIcon marginRight="8px" />
          <InternalPrefix operation={operation} />
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
            <Text marginRight="6px" color={colors.gray[450]}>
              From:
            </Text>
            <AddressPill address={operation.sender} />
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
