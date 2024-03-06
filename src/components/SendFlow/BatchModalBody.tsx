import { Flex, FormLabel, ModalBody, Text } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import React from "react";

import { FormPageHeader } from "./FormPageHeader";
import { SignPageFee } from "./SignPageFee";
import { subTitle } from "./SignPageHeader";
import colors from "../../style/colors";
import { ImplicitAccount } from "../../types/Account";
import { AddressTile } from "../AddressTile/AddressTile";

export const BatchModalBody: React.FC<{
  fee: BigNumber;
  title: string;
  signer: ImplicitAccount;
  transactionCount: number;
}> = ({ title, fee, transactionCount, signer }) => (
  <>
    <FormPageHeader subTitle={subTitle(signer)} title={title} />
    <ModalBody>
      <FormLabel>From</FormLabel>
      <AddressTile address={signer.address} />
      <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
        <Flex>
          <Text marginRight="4px" color={colors.gray[450]} size="sm">
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
