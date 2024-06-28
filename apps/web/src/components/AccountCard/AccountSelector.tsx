import { Flex, IconButton, Text, useColorMode } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { useAppSelector } from "@umami/state";

import { ChevronDownIcon, FileCopyIcon, GoogleSocialIcon } from "../../assets/icons";
import { dark, light } from "../../styles/colors";

export const AccountSelector = () => {
  const colorMode = useColorMode();
  const accounts = useAppSelector(s => s.accounts.items);

  return (
    <Flex
      alignItems="center"
      padding="12px 20px 12px 12px"
      background={mode(light.grey[50], dark.grey[50])(colorMode)}
      borderRadius="100px"
      _hover={{ background: mode(light.grey[100], dark.grey[100])(colorMode) }}
    >
      <GoogleSocialIcon color={mode(light.grey.white, dark.grey.white)(colorMode)} />
      <Flex flexDirection="column" gap="4px" margin="0 25px 0 10px">
        <Text size="md" variant="bold">
          helloumami@email.com
        </Text>
        <Flex alignItems="center" gap="4px">
          <Text color={mode(light.grey[700], dark.grey[700])(colorMode)} size="sm">
            {accounts[0].label}
          </Text>
          <IconButton
            aria-label="Copy Address"
            icon={<FileCopyIcon color={mode(light.grey[400], dark.grey[400])(colorMode)} />}
            variant="empty"
          />
        </Flex>
      </Flex>
      <IconButton
        aria-label="Account Selector"
        icon={<ChevronDownIcon color={mode(light.grey[500], dark.grey[500])(colorMode)} />}
        variant="empty"
      />
    </Flex>
  );
};
