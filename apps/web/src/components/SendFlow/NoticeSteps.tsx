import { Box, Center, Flex, type FlexProps, Heading } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";

import { useColor } from "../../styles/useColor";

export const NoticeSteps = ({ steps, ...props }: { steps: string[] } & FlexProps) => {
  const color = useColor();

  return (
    <Flex {...props}>
      {steps.map((step, index) => (
        <Fragment key={step}>
          <Center
            gap="10px"
            color={color("400")}
            border="1px solid"
            borderColor={color("500")}
            borderRadius="100px"
            paddingX="15px"
            paddingY="10px"
          >
            <Heading
              width="26px"
              height="26px"
              padding="4px"
              textAlign="center"
              background={color("500")}
              borderRadius="100%"
              size="sm"
            >
              {index + 1}
            </Heading>
            <Heading textTransform="uppercase" size="sm">
              {step}
            </Heading>
          </Center>
          {index < steps.length - 1 && (
            <Center flexGrow={2}>
              <Box width="30px" height="1px" border="1px solid" borderColor={color("500")} />
            </Center>
          )}
        </Fragment>
      ))}
    </Flex>
  );
};
