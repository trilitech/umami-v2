import { ReactChild } from "react";
import { VStack, Heading, Box, Text } from "@chakra-ui/react";
import { CircleIcon, SupportedIcons } from "../CircleIcon";
import colors from "../../style/colors";

type Props = {
  title: string;
  subtitle?: string;
  icon: SupportedIcons;
  children: ReactChild;
};

export default function ModalContentWrapper({ children, icon, title, subtitle }: Props) {
  return (
    <VStack p="40px" maxH="83vh">
      <Box p="10px">
        <CircleIcon size="48px" icon={icon} />
      </Box>
      <Heading size="xl">{title}</Heading>
      <Text textAlign="center" size="sm" color={colors.gray[400]}>
        {subtitle}
      </Text>
      <Box h="20px" />
      {children}
    </VStack>
  );
}
