import { Box, Center, Flex, FlexProps, Heading } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";

import colors from "../../style/colors";

export const NoticeSteps = ({ steps, ...props }: { steps: string[] } & FlexProps) => (
  <Flex {...props}>
    {steps.map((step, index) => (
      <Fragment key={step}>
        <Center
          gap="10px"
          color={colors.gray[400]}
          border="1px solid"
          borderColor={colors.gray[500]}
          borderRadius="100px"
          paddingX="15px"
          paddingY="10px"
        >
          <Heading
            width="26px"
            height="26px"
            padding="4px"
            textAlign="center"
            background={colors.gray[500]}
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
            <Box width="30px" height="1px" border="1px solid" borderColor={colors.gray[500]} />
          </Center>
        )}
      </Fragment>
    ))}
  </Flex>
);
