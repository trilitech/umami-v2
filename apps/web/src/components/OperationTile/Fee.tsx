import { Flex, Text } from "@chakra-ui/react";
import { useIsOwnedAddress } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import {
  type DelegationOperation,
  type FinalizeUnstakeOperation,
  type OriginationOperation,
  type StakeOperation,
  type TransactionOperation,
  type UnstakeOperation,
} from "@umami/tzkt";
import { BigNumber } from "bignumber.js";
import { get } from "lodash";
import { memo, useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import { useColor } from "../../styles/useColor";

const FEE_FIELDS = ["bakerFee", "storageFee", "allocationFee"];

export const Fee = memo(
  ({
    operation,
  }: {
    operation:
      | TransactionOperation
      | DelegationOperation
      | OriginationOperation
      | StakeOperation
      | UnstakeOperation
      | FinalizeUnstakeOperation;
  }) => {
    const color = useColor();
    const tileContext = useContext(OperationTileContext);
    const isOwned = useIsOwnedAddress();
    const isOutgoing = isOwned(operation.sender.address);

    if (tileContext.mode === "drawer") {
      return null;
    }

    // if the wallet holder paid the fee then we show it, otherwise there is no need to
    if (!isOutgoing) {
      return null;
    }

    const totalFee = FEE_FIELDS.reduce((acc, curr) => {
      if (curr in operation) {
        return acc.plus(get(operation, curr) || 0);
      }

      return acc;
    }, BigNumber(0));

    if (totalFee.eq(0)) {
      return null;
    }

    return (
      <Flex gap="4px" color={color("600")} lineHeight="22px">
        <Text size="md">Fee:</Text>
        <Text data-testid="fee">{prettyTezAmount(totalFee)}</Text>
      </Flex>
    );
  }
);
