import { Flex, Heading } from "@chakra-ui/react";

const splitNumber = (num: string) => {
  const [integer, decimal] = num.split(".");
  return { integer, decimal };
};

export const PrettyNumber: React.FC<{
  number: string;
  size?: "md" | "lg";
}> = ({ number, size = "md" }) => {
  const intSize = size === "md" ? "md" : "lg";
  const fractionSize = size === "md" ? "sm" : "md";

  const { integer, decimal } = splitNumber(number);

  return (
    <Flex alignItems="end" data-testid="pretty-number">
      <Heading size={intSize}>{integer}</Heading>
      {decimal && (
        <Heading size={fractionSize} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          .{decimal}
        </Heading>
      )}
    </Flex>
  );
};
