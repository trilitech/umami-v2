import { Flex, FlexProps, Heading } from "@chakra-ui/react";

const splitNumber = (num: string) => {
  const [integer, decimal] = num.split(".");
  return { integer, decimal };
};

export const PrettyNumber: React.FC<
  {
    number: string;
    size?: "md" | "lg";
  } & FlexProps
> = ({ number, size = "md", ...props }) => {
  const intSize = size === "md" ? "md" : "lg";
  const fractionSize = size === "md" ? "sm" : "md";

  const { integer, decimal } = splitNumber(number);

  return (
    <Flex alignItems="end" data-testid="pretty-number" {...props}>
      <Heading size={intSize}>{integer}</Heading>
      {decimal && (
        <Heading overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" size={fractionSize}>
          .{decimal}
        </Heading>
      )}
    </Flex>
  );
};
