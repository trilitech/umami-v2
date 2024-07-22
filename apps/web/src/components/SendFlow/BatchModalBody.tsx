import { Flex, FormLabel, ModalBody, Text } from "@chakra-ui/react";
import { type EstimatedAccountOperations, totalFee } from "@umami/core";
import { type PropsWithChildren } from "react";

import { FormPageHeader } from "./FormPageHeader";
import { SignPageFee } from "./SignPageFee";
import { subTitle } from "./SignPageHeader";
import { useColor } from "../../styles/useColor";
import { AddressTile } from "../AddressTile/AddressTile";

export const BatchModalBody = ({
  title,
  operation,
  transactionCount,
  children,
}: PropsWithChildren<{
  title: string;
  operation: EstimatedAccountOperations;
  transactionCount: number;
}>) => {
  const color = useColor();
  return (
    <>
      <FormPageHeader subTitle={subTitle(operation.signer)} title={title} />
      <ModalBody>
        <FormLabel>From</FormLabel>
        <AddressTile address={operation.signer.address} />
        <Flex alignItems="center" justifyContent="space-between" marginY="12px" paddingX="4px">
          <Flex>
            <Text marginRight="4px" color={color("450")} size="sm">
              Transactions:
            </Text>
            <Text color={color("400")} data-testid="transaction-length" size="sm">
              {transactionCount}
            </Text>
          </Flex>
          <SignPageFee fee={totalFee(operation.estimates)} />
        </Flex>
        {children}
      </ModalBody>
    </>
  );
};
