import { Flex, Text } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import { formatPkh } from "@umami/tezos";

import { GoogleSocialIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { CopyButton } from "../CopyButton/CopyButton";
import { SocialIconWrapper } from "../IconWrapper";

type AccountSelectorProps = {
  account: ImplicitAccount;
  sideElement?: React.ReactNode;
  highlighted?: boolean;
};

export const AccountSelector = ({ account, sideElement, highlighted }: AccountSelectorProps) => {
  const color = useColor();

  return (
    <Flex
      alignItems="center"
      width="full"
      padding="12px 20px 12px 12px"
      color={color("700")}
      background={highlighted ? color("50") : "transparent"}
      borderRadius="100px"
      _hover={{ background: color("100") }}
    >
      <SocialIconWrapper color={color("white")}>
        <GoogleSocialIcon />
      </SocialIconWrapper>
      <Flex flexDirection="column" gap="4px" margin="0 25px 0 10px">
        <Text size="md" variant="bold">
          {account.label}
        </Text>
        <Flex alignItems="center" gap="4px">
          <Text size="sm">{formatPkh(account.address.pkh)}</Text>
          <CopyButton value={account.address.pkh} />
        </Flex>
      </Flex>
      {sideElement}
    </Flex>
  );
};
