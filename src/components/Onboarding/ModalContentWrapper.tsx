import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { ReactElement } from "react";

import colors from "../../style/colors";
import { CircleIcon } from "../CircleIcon";

type Props = {
  title: string;
  subtitle?: string;
  icon: ReactElement;
  children: ReactElement;
};

export const ModalContentWrapper = ({ children, icon, title, subtitle }: Props) => (
  <VStack maxHeight="83vh" spacing={0}>
    <Box marginBottom="16px">
      <CircleIcon icon={icon} size="48px" />
    </Box>
    <Center flexDirection="column" width="340px" marginBottom="32px">
      <Heading lineHeight="26px" size="xl">
        {title}
      </Heading>
      {subtitle && (
        <Text
          marginTop="10px"
          color={colors.gray[400]}
          lineHeight="18px"
          textAlign="center"
          size="sm"
        >
          {subtitle}
        </Text>
      )}
    </Center>
    {children}
  </VStack>
);
