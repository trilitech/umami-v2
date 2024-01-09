import { Flex, FormLabel, ModalBody, Text } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import React from "react";

import { FormPageHeader } from "./FormPageHeader";
import { SignPageFee } from "./SignPageFee";
import colors from "../../style/colors";
import { ImplicitAddress } from "../../types/Address";
import { AddressTile } from "../AddressTile/AddressTile";

export const BatchModalBody: React.FC<{
  fee: BigNumber;
  title: string;
  signerAddress: ImplicitAddress;
  transactionCount: number;
}> = ({ title, fee, transactionCount, signerAddress }) => {
  return (
    <>
      <FormPageHeader subTitle="Enter your password to confirm this transaction." title={title} />
      <ModalBody>
        <FormLabel>From</FormLabel>
        <AddressTile address={signerAddress} />
        <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
          <Flex>
            <Text marginRight={1} color={colors.gray[450]} size="sm">
              Transactions:
            </Text>
            <Text color={colors.gray[400]} data-testid="transaction-length" size="sm">
              {transactionCount}
            </Text>
          </Flex>
          <SignPageFee fee={fee} />
        </Flex>
      </ModalBody>
    </>
  );
};
