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

export default function ModalContentWrapper({ children, icon, title, subtitle }: Props) {
  return (
    <VStack maxH="83vh" spacing={0}>
      <Box mb="20px">
        <CircleIcon size="48px" icon={icon} />
      </Box>
      <Center mb="32px" flexDirection="column">
        <Heading size="xl">{title}</Heading>
        {subtitle && (
          <Text textAlign="center" size="sm" mt="10px" color={colors.gray[400]} mb="20px">
            {subtitle}
          </Text>
        )}
      </Center>
      {children}
    </VStack>
  );
}
