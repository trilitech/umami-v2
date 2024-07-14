import { Flex, type FlexProps, Heading, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { type OperationDestination } from "@umami/state";
import { type Address, prettyTezAmount } from "@umami/tezos";
import { type TzktAlias } from "@umami/tzkt";
import { type ReactNode } from "react";

import { OperationStatus as OperationStatusComponent } from "./OperationStatus";
import { Timestamp } from "./Timestamp";
import { type OperationStatus } from "./useOperationStatus";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill";

type Props = {
  icon: ReactNode;
  title: ReactNode;
  fee: number | string | null;
  destination: OperationDestination;
  from?: TzktAlias | Address | null;
  to?: TzktAlias | Address | null;
  timestamp: string;
  operationType: string;
  status: OperationStatus;
} & Omit<FlexProps, "title">;

/**
 * This is a bare bones view for a single operation tile
 */
export const OperationTileView = ({
  title,
  destination,
  fee,
  from,
  to,
  icon,
  timestamp,
  operationType,
  status,
  ...props
}: Props) => {
  const color = useColor();

  return (
    <Flex flexDirection="column" gap="10px" width="100%" {...props}>
      <Wrap spacing="10px">
        <WrapItem lineHeight="22px">
          {icon}
          {destination === "unrelated" && (
            <Heading marginRight="4px" color={color("900")} data-testid="internal-prefix" size="sm">
              Internal:
            </Heading>
          )}
          {title}
        </WrapItem>

        {fee && (
          <WrapItem>
            <Flex gap="4px" color={color("600")} lineHeight="22px">
              <Text size="md">Fee:</Text>
              <Text data-testid="fee">{prettyTezAmount(fee)}</Text>
            </Flex>
          </WrapItem>
        )}
      </Wrap>

      <Wrap justify="space-between" spacing="10px">
        <WrapItem>
          <Wrap spacing="10px">
            {to && (
              <WrapItem data-testid="to">
                <Text marginRight="8px" color={color("600")}>
                  To:
                </Text>
                <AddressPill address={to} />
              </WrapItem>
            )}

            {from && (
              <WrapItem data-testid="from">
                <Text marginRight="8px" color={color("600")}>
                  From:
                </Text>
                <AddressPill address={from} />
              </WrapItem>
            )}
          </Wrap>
        </WrapItem>

        <WrapItem alignItems="center">
          <Flex gap="10px">
            <Timestamp timestamp={timestamp} />

            <Flex gap="4px">
              <Text color={color("600")} data-testid="operation-type" size="sm">
                {operationType}
              </Text>
              <OperationStatusComponent status={status} />
            </Flex>
          </Flex>
        </WrapItem>
      </Wrap>
    </Flex>
  );
};
