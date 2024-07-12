import { Flex, type FlexProps, Text } from "@chakra-ui/react";
import { useAddressKind } from "@umami/components";
import { useGetAccountBalance } from "@umami/state";
import { type Address, formatPkh, prettyTezAmount } from "@umami/tezos";

import { GoogleSocialIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { CopyButton } from "../CopyButton/CopyButton";
import { SocialIconWrapper } from "../IconWrapper";

type AccountSelectorProps = {
  account: { name?: string; pkh: string; address?: Address };
  showBalance?: boolean;
  highlighted?: boolean;
} & FlexProps;

export const AccountSelector = ({
  account,
  showBalance,
  highlighted,
  ...props
}: AccountSelectorProps) => {
  const color = useColor();
  const balance = useGetAccountBalance()(account.pkh);
  const addressKind = useAddressKind(account.address ?? ({} as Address));

  return (
    <Flex
      alignItems="center"
      width="full"
      padding="12px 20px 12px 12px"
      color={color("700")}
      background={highlighted ? color("50") : "transparent"}
      borderRadius="100px"
      _hover={{ background: color("100") }}
      {...props}
    >
      <SocialIconWrapper color={color("white")}>
        <GoogleSocialIcon />
      </SocialIconWrapper>
      <Flex flexDirection="column" gap="4px" margin="0 25px 0 10px">
        <Text whiteSpace="nowrap" size="md" variant="bold">
          {account.name || addressKind.label}
        </Text>
        <Flex alignItems="center" gap="4px">
          <Text size="sm">{formatPkh(account.pkh)}</Text>
          <CopyButton value={account.pkh} />
        </Flex>
      </Flex>
      {showBalance && balance ? (
        <Text width="full" marginTop="auto" paddingBottom="2px" textAlign="end" size="sm">
          {prettyTezAmount(balance)}
        </Text>
      ) : null}
    </Flex>
  );
};
