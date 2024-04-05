import { Center, Heading, Text } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import { get } from "lodash";
import React, { useContext } from "react";

import { OperationTileContext } from "./OperationTileContext";
import colors from "../../style/colors";
import { prettyTezAmount } from "../../utils/format";
import { useIsOwnedAddress } from "../../utils/hooks/getAccountDataHooks";
import { DelegationOperation, OriginationOperation, TransactionOperation } from "../../utils/tezos";

const FEE_FIELDS = ["bakerFee", "storageFee", "allocationFee"];

export const Fee: React.FC<{
  operation: TransactionOperation | DelegationOperation | OriginationOperation;
}> = ({ operation }) => {
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
    <Center>
      <Heading marginRight="4px" color={colors.gray[450]} size="md">
        Fee:
      </Heading>
      <Text color={colors.gray[400]} data-testid="fee">
        {prettyTezAmount(totalFee)}
      </Text>
    </Center>
  );
};
