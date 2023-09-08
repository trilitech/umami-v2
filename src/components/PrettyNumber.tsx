import { Flex, Heading } from "@chakra-ui/react";

const splitNumber = (num: string) => {
  const [integer, decimal] = num.split(".");
  return { integer, decimal };
};

export const PrettyNumber: React.FC<{ number: string }> = ({ number }) => {
  const { integer, decimal } = splitNumber(number);
  return (
    <Flex alignItems="end" data-testid="pretty-number">
      <Heading size="md">{integer}</Heading>
      {decimal && <Heading size="sm">.{decimal}</Heading>}
    </Flex>
  );
};
