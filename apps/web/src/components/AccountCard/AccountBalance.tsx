import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";

import { ArrowDownLeftIcon, PlusIcon } from "../../assets/icons";

export const AccountBalance = () => (
  <Box paddingX="12px">
    <Flex flexDirection="column" gap="4px">
      <Text fontWeight="600" size="sm">
        Tez Balance
      </Text>
      <Text size="2xl" variant="bold">
        2882.675746 ꜩ
      </Text>
      <Text size="sm">$3603.34</Text>
    </Flex>
    <Flex alignItems="center" justifyContent="space-between" marginTop="40px">
      <IconButton
        aria-label="Deposit"
        icon={<PlusIcon width="24px" height="24px" />}
        isRound
        size="lg"
        variant="iconButtonSolid"
      />
      <IconButton
        marginRight="12px"
        marginLeft="auto"
        borderRadius="full"
        aria-label="Send"
        icon={<ArrowDownLeftIcon />}
        size="lg"
        variant="iconButtonOutline"
      />
      <Button padding="10px 40px" borderRadius="full" size="lg" variant="solidPrimary">
        Send
      </Button>
    </Flex>
  </Box>
);
