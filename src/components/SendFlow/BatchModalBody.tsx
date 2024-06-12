import { Flex, FormLabel, ModalBody, Text } from "@chakra-ui/react";
import React from "react";

import { FormPageHeader } from "./FormPageHeader";
import { SignPageFee } from "./SignPageFee";
import { subTitle } from "./SignPageHeader";
import colors from "../../style/colors";
import { EstimatedAccountOperations, totalFee } from "../../types/AccountOperations";
import { AddressTile } from "../AddressTile/AddressTile";

export const BatchModalBody: React.FC<{
  title: string;
  operation: EstimatedAccountOperations;
  transactionCount: number;
  children?: React.ReactNode;
}> = ({ title, operation, transactionCount, children }) => (
  <>
    <FormPageHeader subTitle={subTitle(operation.signer)} title={title} />
    <ModalBody>
      <FormLabel>From</FormLabel>
      <AddressTile address={operation.signer.address} />
      <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
        <Flex>
          <Text marginRight="4px" color={colors.gray[450]} size="sm">
            Transactions:
          </Text>
          <Text color={colors.gray[400]} data-testid="transaction-length" size="sm">
            {transactionCount}
          </Text>
        </Flex>
        <SignPageFee fee={totalFee(operation.estimates)} />
      </Flex>
      {children}
    </ModalBody>
  </>
);
