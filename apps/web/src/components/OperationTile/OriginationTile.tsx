import { Flex, type FlexProps, Heading, Icon, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { CODE_HASH, TYPE_HASH } from "@umami/multisig";
import { type OriginationOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TzktLink } from "./TzktLink";
import { ContractIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const OriginationTile = memo(
  ({ operation, ...props }: { operation: OriginationOperation } & FlexProps) => {
    const color = useColor();

    const isMultisig =
      operation.originatedContract?.codeHash === CODE_HASH &&
      operation.originatedContract.typeHash === TYPE_HASH;

    const contractTitle = isMultisig ? "Multisig Account Created" : "Contract Origination";

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-origination"
        {...props}
      >
        <Wrap spacing="10px">
          <WrapItem>
            <Icon
              as={ContractIcon}
              width="22px"
              height="22px"
              marginRight="8px"
              color={color("400")}
            />
            <InternalPrefix operation={operation} />
            <TzktLink
              marginRight="8px"
              counter={operation.counter}
              data-testid="title"
              hash={operation.hash}
            >
              <Heading color={color("900")} size="sm">
                {contractTitle}
              </Heading>
            </TzktLink>
          </WrapItem>

          <WrapItem>
            <Fee operation={operation} />
          </WrapItem>
        </Wrap>

        <Wrap justify="space-between" spacing="10px">
          <WrapItem data-testid="from">
            <Text marginRight="6px" color={color("600")}>
              From:
            </Text>
            <AddressPill address={operation.sender} />
          </WrapItem>

          <WrapItem alignItems="center">
            <RightBlock
              level={operation.level}
              operationType="Contract Origination"
              status={operation.status}
              timestamp={operation.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
