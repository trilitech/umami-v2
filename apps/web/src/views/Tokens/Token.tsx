import { Button, Flex, Text } from "@chakra-ui/react";

import { UnknownSocialIcon } from "../../assets/icons";
import { CopyButton } from "../../components/CopyButton/CopyButton";
import { TokenIconWrapper } from "../../components/IconWrapper";
import { useColor } from "../../styles/useColor";

export const Token = ({ token }) => {
  const color = useColor();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      width="full"
      _first={{
        paddingTop: 0,
      }}
      _last={{
        paddingBottom: 0,
      }}
      _notLast={{
        borderBottom: `1px solid ${color("100")}`,
      }}
      paddingY="30px"
    >
      <TokenIconWrapper>
        {/* TODO: replace with real icon from api */}
        <UnknownSocialIcon />
      </TokenIconWrapper>
      <Flex flexDirection="column" flex="1" gap="4px" marginLeft="12px">
        <Text size="md" variant="bold">
          {token.title}
        </Text>
        <Flex gap="4px">
          <Text size="sm">{token.address}</Text>
          <CopyButton value={token.address} />
        </Flex>
      </Flex>
      <Flex flexDirection="column" flex="1" gap="4px">
        <Text size="md" variant="bold">
          {token.amount}
        </Text>
        <Text size="sm">{token.price}</Text>
      </Flex>
      <Button padding="10px 24px" borderRadius="full" size="lg" variant="primary">
        Send
      </Button>
    </Flex>
  );
};
