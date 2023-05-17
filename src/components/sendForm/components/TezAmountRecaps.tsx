import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../../../utils/format";

type Props = { tez: BigNumber } & FlexProps;

export const TransactionsAmount = ({
  amount,
  ...flexProps
}: { amount: number } & FlexProps) => {
  return (
    <Flex
      aria-label="transactions-amount"
      alignItems={"center"}
      justifyContent="space-between"
      {...flexProps}
    >
      <Heading size="sm" color="text.dark">
        Transactions
      </Heading>
      <Text size="sm">{amount}</Text>
    </Flex>
  );
};

export const Subtotal = ({ tez, ...flexProps }: Props) => {
  return (
    <Flex
      aria-label="sub-total"
      alignItems={"center"}
      justifyContent="space-between"
      {...flexProps}
    >
      <Heading size="sm" color="text.dark">
        Subtotal
      </Heading>
      <Text size="sm">{prettyTezAmount(tez, true)}</Text>
    </Flex>
  );
};

export const Total = ({ tez, ...flexProps }: Props) => {
  return (
    <Flex
      aria-label="total"
      alignItems={"center"}
      justifyContent="space-between"
      {...flexProps}
      mt={2}
      mb={2}
    >
      <Heading size="sm" color="text.dark">
        Total
      </Heading>
      <Text size="sm">{prettyTezAmount(tez, true)}</Text>
    </Flex>
  );
};

export const Fee = ({
  mutez,
  ...flexProps
}: { mutez: BigNumber } & FlexProps) => {
  return (
    <Flex
      aria-label="fee"
      alignItems={"center"}
      justifyContent="space-between"
      mb={2}
      {...flexProps}
    >
      <Heading size="sm" color="text.dark">
        Fee
      </Heading>
      <Text size="sm">{prettyTezAmount(mutez)}</Text>
    </Flex>
  );
};
