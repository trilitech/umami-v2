import { Flex, type FlexProps, Heading, Icon, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { type DelegationOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TzktLink } from "./TzktLink";
import { DelegateIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const DelegationTile = memo(
  ({ operation, ...props }: { operation: DelegationOperation } & FlexProps) => {
    const color = useColor();
    const operationType = operation.newDelegate ? "Delegate" : "Delegation Ended";

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-delegation"
        {...props}
      >
        <Wrap spacing="10px">
          <WrapItem>
            <Flex>
              <Icon
                as={DelegateIcon}
                width="22px"
                height="22px"
                marginRight="8px"
                color={color("400")}
              />
              <InternalPrefix operation={operation} />
              <TzktLink counter={operation.counter} data-testid="title" hash={operation.hash}>
                <Heading color={color("900")} size="sm">
                  {operationType}
                </Heading>
              </TzktLink>
            </Flex>
          </WrapItem>

          <WrapItem>
            <Fee operation={operation} />
          </WrapItem>
        </Wrap>

        <Wrap justify="space-between" spacing="10px">
          <WrapItem>
            <Wrap spacing="10px">
              {operation.newDelegate && (
                <WrapItem data-testid="to">
                  <Text marginRight="6px" color={color("600")}>
                    To:
                  </Text>
                  <AddressPill address={operation.newDelegate} />
                </WrapItem>
              )}

              <WrapItem data-testid="from">
                <Text marginRight="6px" color={color("600")}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </WrapItem>
            </Wrap>
          </WrapItem>

          <WrapItem alignItems="center">
            <RightBlock
              level={operation.level}
              operationType={operationType}
              status={operation.status}
              timestamp={operation.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
