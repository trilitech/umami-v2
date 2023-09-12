import React from "react";

import { ModalBody, Text, Flex, FormLabel } from "@chakra-ui/react";

import { BigNumber } from "bignumber.js";
import colors from "../../style/colors";
import FormPageHeader from "./FormPageHeader";
import AddressTile from "../AddressTile/AddressTile";
import SignPageFee from "./SignPageFee";
import { ImplicitAddress } from "../../types/Address";

export const BatchModalBody: React.FC<{
  fee: BigNumber;
  title: string;
  signerAddress: ImplicitAddress;
  transactionCount: number;
}> = ({ title, fee, transactionCount, signerAddress }) => {
  return (
    <>
      <FormPageHeader title={title} subTitle=" Enter your password to confirm this transaction." />
      <ModalBody>
        <FormLabel>From</FormLabel>
        <AddressTile address={signerAddress} />
        <Flex my="12px" px="4px" alignItems="center" justifyContent="space-between">
          <Flex>
            <Text size="sm" mr={1} color={colors.gray[450]}>
              Transactions:
            </Text>
            <Text size="sm" data-testid="transaction-length" color={colors.gray[400]}>
              {transactionCount}
            </Text>
          </Flex>
          <SignPageFee fee={fee} />
        </Flex>
      </ModalBody>
    </>
  );
};

export default BatchModalBody;
