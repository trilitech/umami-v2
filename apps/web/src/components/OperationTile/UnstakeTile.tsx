import { Flex, type FlexProps, Heading, Icon, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { parsePkh, prettyTezAmount } from "@umami/tezos";
import { type UnstakeOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TzktLink } from "./TzktLink";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const UnstakeTile = memo(
  ({ operation, ...props }: { operation: UnstakeOperation } & FlexProps) => {
    const color = useColor();
    const amount = prettyTezAmount(String(operation.amount));

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-unstake"
        {...props}
      >
        <Wrap spacing="10px">
          <WrapItem>
            <Icon
              as={DelegateIcon}
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
              <Flex gap="4px">
                <Heading color={color("900")} size="sm">
                  Unstake:
                </Heading>
                <Text lineHeight="22px">{amount}</Text>
              </Flex>
            </TzktLink>
          </WrapItem>
          <WrapItem>
            <Fee operation={operation} />
          </WrapItem>
        </Wrap>

        <Wrap justify="space-between" spacing="10px">
          <WrapItem>
            <Wrap spacing="10px">
              <WrapItem gap="6px" data-testid="to">
                <Text color={color("600")}>From:</Text>
                <AddressPill address={parsePkh(operation.baker.address)} />
              </WrapItem>

              <WrapItem gap="6px" data-testid="from">
                <Text color={color("600")}>To:</Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </WrapItem>
            </Wrap>
          </WrapItem>

          <WrapItem>
            <RightBlock
              level={operation.level}
              operationType="Unstake"
              status={operation.status}
              timestamp={operation.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
