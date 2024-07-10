import { Flex, type FlexProps, Heading, Icon, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { type TransactionOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TzktLink } from "./TzktLink";
import { ContractIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const ContractCallTile = memo(
  ({ operation, ...props }: { operation: TransactionOperation } & FlexProps) => {
    const color = useColor();

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-contract-call"
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
            <TzktLink counter={operation.counter} data-testid="title" hash={operation.hash}>
              <Heading color={color("900")} size="sm">
                Contract Call: {operation.parameter?.entrypoint}
              </Heading>
            </TzktLink>
          </WrapItem>

          <WrapItem>
            <Fee operation={operation} />
          </WrapItem>
        </Wrap>

        <Wrap justify="space-between" spacing="10px">
          <WrapItem>
            <Wrap spacing="10px">
              {operation.target && (
                <WrapItem data-testid="to">
                  <Text marginRight="6px" color={color("600")}>
                    To:
                  </Text>
                  <AddressPill address={operation.target} />
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
              operationType="Contract Call"
              status={operation.status}
              timestamp={operation.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
