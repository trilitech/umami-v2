import { Box, Center, Circle, Heading, Text, VStack } from "@chakra-ui/react";
import { type PropsWithChildren, type ReactElement } from "react";

import { useColor } from "../../styles/useColor";

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  icon: ReactElement;
}>;

export const ModalContentWrapper = ({ children, icon, title, subtitle }: Props) => {
  const color = useColor();

  return (
    <VStack maxHeight="83vh" spacing={0}>
      <Box marginBottom="16px">
        <Circle size="48px">{icon}</Circle>
      </Box>
      <Center flexDirection="column" width="340px" marginBottom="32px">
        <Heading lineHeight="26px" size="xl">
          {title}
        </Heading>
        {subtitle && (
          <Text
            marginTop="10px"
            color={color("600")}
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
};
