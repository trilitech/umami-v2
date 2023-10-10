import { ReactElement } from "react";
import { VStack, Heading, Box, Text } from "@chakra-ui/react";
import { CircleIcon, SupportedIcons } from "../CircleIcon";
import colors from "../../style/colors";

type Props = {
  title: string;
  subtitle?: string;
  icon: SupportedIcons;
  children: ReactElement;
};

export default function ModalContentWrapper({ children, icon, title, subtitle }: Props) {
  return (
    <VStack maxH="83vh">
      <Box>
        <CircleIcon size="48px" icon={icon} />
      </Box>
      <Heading size="xl">{title}</Heading>
      {subtitle && (
        <Text textAlign="center" size="sm" color={colors.gray[400]} mb="20px">
          {subtitle}
        </Text>
      )}
      {children}
    </VStack>
  );
}
