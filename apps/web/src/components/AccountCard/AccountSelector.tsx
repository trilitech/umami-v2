import { Flex, IconButton, Text } from "@chakra-ui/react";
import { useAppSelector } from "@umami/state";
import { formatPkh } from "@umami/tezos";

import { ChevronDownIcon, GoogleSocialIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { CopyButton } from "../CopyButton/CopyButton";
import { SocialIconWrapper } from "../IconWrapper";

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
      <SocialIconWrapper color={color("white")}>
        <GoogleSocialIcon />
      </SocialIconWrapper>
      <Flex flexDirection="column" gap="4px" margin="0 25px 0 10px">
        <Text size="md" variant="bold">
          helloumami@email.com
        </Text>
        <Flex alignItems="center" gap="4px">
          <Text color={color("700")} size="sm">
            {formatPkh(accounts[0].address.pkh)}
          </Text>
          <CopyButton value={accounts[0].address.pkh} />
        </Flex>
      </Flex>
      <IconButton
        width="fit-content"
        marginLeft="auto"
        color={color("500")}
        aria-label="Account Selector"
        icon={<ChevronDownIcon />}
        variant="empty"
      />
    </Flex>
  );
};
