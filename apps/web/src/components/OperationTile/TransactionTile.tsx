import { Flex, type FlexProps, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { operationSign } from "@umami/core";
import { useGetOperationDestination } from "@umami/state";
import { parsePkh, prettyTezAmount } from "@umami/tezos";
import { type TransactionOperation } from "@umami/tzkt";
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useOperationColor } from "./useOperationColor";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const TransactionTile = memo(
  ({ operation, ...props }: { operation: TransactionOperation } & FlexProps) => {
    const color = useColor();
    const operationDestination = useGetOperationDestination(
      operation.sender.address,
      operation.target?.address
    );
    const amount = prettyTezAmount(String(operation.amount));

    const titleColor = useOperationColor(operationDestination);
    const sign = operationSign(operationDestination);

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-transaction"
        {...props}
      >
        <Wrap spacing="10px">
          <WrapItem>
            <TransactionDirectionIcon marginRight="8px" destination={operationDestination} />
            <InternalPrefix operation={operation} />
            <TzktLink
              color={titleColor}
              counter={operation.counter}
              data-testid="title"
              hash={operation.hash}
            >
              <Heading color={titleColor} size="sm">
                {sign} {amount}
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
                  <AddressPill address={parsePkh(operation.target.address)} />
                </WrapItem>
              )}

              <WrapItem data-testid="from">
                <Text marginRight="6px" color={color("600")}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </WrapItem>
            </Wrap>
          </WrapItem>

          <WrapItem alignItems="center">
            <RightBlock
              level={operation.level}
              operationType="Transaction"
              status={operation.status}
              timestamp={operation.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
