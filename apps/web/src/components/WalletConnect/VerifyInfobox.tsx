import { Box, Card, HStack, Icon, VStack } from "@chakra-ui/react";

import { AlertCircleIcon } from "../../assets/icons";

export const VerifyInfobox = () => (
  <Box textAlign="center">
    <VStack spacing="16px">
      <HStack margin="auto">
        <Icon as={AlertCircleIcon} verticalAlign="bottom" />
        <Card marginLeft="8px">Unknown domain</Card>
      </HStack>
      <Box margin="auto">
        <Card>This domain was not verified. To be implemented.</Card>
      </Box>
    </VStack>
  </Box>
);
