import { Flex, FlexProps, Heading, Text } from "@chakra-ui/react";
import colors from "../../../style/colors";
import { mutezToTez, prettyTezAmount } from "../../../utils/format";
import { useTezToDollar } from "../../../utils/hooks/assetsHooks";

type Props = { mutez: string } & FlexProps;

export const TransactionsAmount = ({ amount, ...flexProps }: { amount: number } & FlexProps) => {
  return (
    <Flex
      aria-label="transactions-amount"
      alignItems="center"
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

export const Subtotal = ({ mutez, ...flexProps }: Props) => {
  return (
    <Flex aria-label="sub-total" alignItems="center" justifyContent="space-between" {...flexProps}>
      <Heading size="sm" color="text.dark">
        Subtotal
      </Heading>
      <Text size="sm">{prettyTezAmount(mutez)}</Text>
    </Flex>
  );
};

export const Total = ({ mutez, ...flexProps }: Props) => {
  const tezToDollar = useTezToDollar();
  const totalUsdPrice = tezToDollar(mutezToTez(mutez));
  return (
    <Flex
      aria-label="total"
      alignItems="start"
      justifyContent="space-between"
      {...flexProps}
      mt={2}
      mb={2}
    >
      <Heading size="md" color={colors.gray[400]}>
        Total
      </Heading>
      <Flex flexDirection="column">
        <Heading size="md">{prettyTezAmount(mutez)}</Heading>

        {totalUsdPrice && (
          <Flex alignItems="center" justifyContent="end">
            <Heading size="sm" color={colors.gray[400]}>
              USD:
            </Heading>
            <Text size="sm" color={colors.gray[400]}>
              ${totalUsdPrice.toFixed(2)}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export const Fee = ({ mutez, ...flexProps }: { mutez: string } & FlexProps) => {
  return (
    <Flex aria-label="fee" alignItems="center" justifyContent="space-between" mb={2} {...flexProps}>
      <Heading size="sm" color="text.dark">
        Fee
      </Heading>
      <Text size="sm">{prettyTezAmount(mutez)}</Text>
    </Flex>
  );
};
