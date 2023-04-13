import { Heading, Flex, Text, FlexProps, flexbox } from "@chakra-ui/react";
import React from "react";
import { prettyTezAmount } from "../../../utils/store/impureFormat";

type Props = { tez: number } & FlexProps;

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

export const Fee = ({ mutez, ...flexProps }: { mutez: number } & FlexProps) => {
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
