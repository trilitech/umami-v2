import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type FA12TokenBalance, type FA2TokenBalance, tokenPrettyAmount } from "@umami/core";
import { useCurrentAccount } from "@umami/state";
import { parseContractPkh } from "@umami/tezos";

import { TokenIcon } from "../../assets/icons";
import { CopyAddressButton } from "../../components/CopyAddressButton/CopyAddressButton";
import { TokenIconWrapper } from "../../components/IconWrapper";
import { FormPage as SendTokensFormPage } from "../../components/SendFlow/Token/FormPage";
import { TokenNameWithIcon } from "../../components/TokenNameWithIcon";
import { useColor } from "../../styles/useColor";

type TokenProps = {
  token: FA12TokenBalance | FA2TokenBalance;
};

export const Token = ({ token }: TokenProps) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const address = parseContractPkh(token.contract).pkh;
  const currentAccount = useCurrentAccount()!;

  return (
    <Grid
      as="li"
      gridRowGap={{ base: "18px", md: "0" }}
      gridTemplateColumns={{
        base: "auto",
        md: "1fr 1fr auto",
      }}
      gridTemplateAreas={{
        base: '"token token" "amount action"',
        md: '"token amount action"',
      }}
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
      data-testid="token-card"
      paddingY={{ base: "18px", md: "30px" }}
    >
      <Flex alignItems="center" flex="1" gridArea="token">
        <TokenIconWrapper>
          <TokenIcon width="48px" minWidth="48px" contract={token.contract} rounded="full" />
        </TokenIconWrapper>
        <Flex flexDirection="column" flex="1" gap="4px" maxWidth="304px" marginLeft="12px">
          <TokenNameWithIcon fontWeight="600" size="md" token={token} />
          <CopyAddressButton address={address} />
        </Flex>
      </Flex>
      <Flex flex="1" alignSelf="center" gap="4px" gridArea="amount">
        <Text fontWeight="600" size="md">
          {tokenPrettyAmount(token.balance, token, { showSymbol: false })}
        </Text>
        {/* TODO: implement USD price later */}
        {/* <Text size="sm">{token.price}</Text> */}
      </Flex>

      <Button
        justifySelf="end"
        gridArea="action"
        width="fit-content"
        padding="10px 24px"
        onClick={() => openWith(<SendTokensFormPage sender={currentAccount} token={token} />)}
        size="lg"
        variant="primary"
      >
        Send
      </Button>
    </Grid>
  );
};
