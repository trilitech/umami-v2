import { ReactElement } from "react";
import { VStack, Heading, Box, Text, Center } from "@chakra-ui/react";
import { CircleIcon } from "../CircleIcon";
import colors from "../../style/colors";

type Props = {
  title: string;
  subtitle?: string;
  icon: JSX.Element;
  children: ReactElement;
};

export const ModalContentWrapper = ({ children, icon, title, subtitle }: Props) => {
  return (
    <VStack maxHeight="83vh" spacing={0}>
      <Box marginBottom="20px">
        <CircleIcon icon={icon} size="48px" />
      </Box>
      <Center flexDirection="column" marginBottom="32px">
        <Heading size="xl">{title}</Heading>
        {subtitle && (
          <Text marginTop="10px" color={colors.gray[400]} textAlign="center" size="sm">
            {subtitle}
          </Text>
        )}
      </Center>
      {children}
    </VStack>
  );
};
