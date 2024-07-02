import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useAppSelector } from "@umami/state";

import { ChevronDownIcon, FileCopyIcon, GoogleSocialIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { SocialIconWrapper } from "../shared/SocialIconWrapper";

export const AccountSelector = () => {
  const color = useColor();
  const accounts = useAppSelector(s => s.accounts.items);

  return (
    <Flex
      alignItems="center"
      padding="12px 20px 12px 12px"
      background={color("50")}
      borderRadius="100px"
      _hover={{ background: color("100") }}
    >
      <SocialIconWrapper>
        <GoogleSocialIcon color={color("white")} />
      </SocialIconWrapper>
      <Flex flexDirection="column" gap="4px" margin="0 25px 0 10px">
        <Text size="md" variant="bold">
          helloumami@email.com
        </Text>
        <Flex alignItems="center" gap="4px">
          <Text color={color("700")} size="sm">
            {accounts[0].label}
          </Text>
          <IconButton
            width="fit-content"
            aria-label="Copy Address"
            icon={<FileCopyIcon color={color("400")} />}
            variant="empty"
          />
        </Flex>
      </Flex>
      <IconButton
        width="fit-content"
        marginLeft="auto"
        aria-label="Account Selector"
        icon={<ChevronDownIcon color={color("500")} />}
        variant="empty"
      />
    </Flex>
  );
};
