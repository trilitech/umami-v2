import { Flex, Text, WrapItem, useBreakpointValue } from "@chakra-ui/react";
import { type FA12TokenBalance, type FA2TokenBalance, tokenPrettyAmount } from "@umami/core";
import { formatPkh, parseContractPkh } from "@umami/tezos";
import { useContext } from "react";

import { SendTokensForm } from "./SendTokensForm";
import { TokenIcon } from "../../assets/icons";
import { CopyButton } from "../../components/CopyButton/CopyButton";
import { TokenIconWrapper } from "../../components/IconWrapper";
import { SendButton } from "../../components/SendButton";
import { TokenNameWithIcon } from "../../components/TokenNameWithIcon/TokenNameWithIcon";
import { DynamicModalContext } from "../../providers/DynamicModalProvider";
import { useColor } from "../../styles/useColor";

type TokenProps = {
  token: FA12TokenBalance | FA2TokenBalance;
};

export const Token = ({ token }: TokenProps) => {
  const color = useColor();
  const { openWith } = useContext(DynamicModalContext);
  const address = parseContractPkh(token.contract).pkh;
  const formattedAddress = useBreakpointValue({ base: formatPkh(address), lg: address });

  return (
    <WrapItem
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
        <TokenIcon width="48px" minWidth="48px" contract={token.contract} rounded="full" />
      </TokenIconWrapper>
      <Flex flexDirection="column" flex="1" gap="4px" marginLeft="12px">
        <Text size="md" variant="bold">
          <TokenNameWithIcon token={token} />
        </Text>
        <Flex gap="4px">
          <Text size="sm">{formattedAddress}</Text>
          <CopyButton value={address} />
        </Flex>
      </Flex>
      <Flex flexDirection="column" flex="1" gap="4px">
        <Text size="md" variant="bold">
          {tokenPrettyAmount(token.balance, token, { showSymbol: false })}
        </Text>
        {/* TODO: implement $ price later */}
        {/* <Text size="sm">{token.price}</Text> */}
      </Flex>
      <SendButton onClick={() => openWith(<SendTokensForm token={token} />)} />
    </WrapItem>
  );
};
