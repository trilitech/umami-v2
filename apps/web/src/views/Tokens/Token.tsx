import { Flex, Grid, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type Account,
  type FA12TokenBalance,
  type FA2TokenBalance,
  tokenPrettyAmount,
} from "@umami/core";
import { formatPkh, parseContractPkh } from "@umami/tezos";

import { SendTokensFormPage } from "./SendTokensFormPage";
import { TokenIcon } from "../../assets/icons";
import { CopyButton } from "../../components/CopyButton/CopyButton";
import { TokenIconWrapper } from "../../components/IconWrapper";
import { SendButton } from "../../components/SendButton";
import { TokenNameWithIcon } from "../../components/TokenNameWithIcon";
import { useColor } from "../../styles/useColor";

type TokenProps = {
  token: FA12TokenBalance | FA2TokenBalance;
  account: Account;
};

export const Token = ({ token, account }: TokenProps) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const address = parseContractPkh(token.contract).pkh;
  const formattedAddress = formatPkh(address);

  return (
    <Grid
      as="li"
      gridRowGap={{ base: "18px", lg: "0" }}
      gridTemplateColumns={{
        base: "auto",
        lg: "1fr 1fr auto",
      }}
      gridTemplateAreas={{
        base: '"token token" "amount action"',
        lg: '"token amount action"',
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
      paddingY={{ base: "18px", lg: "30px" }}
    >
      <Flex flex="1" gridArea="token">
        <TokenIconWrapper>
          <TokenIcon width="48px" minWidth="48px" contract={token.contract} rounded="full" />
        </TokenIconWrapper>
        <Flex flexDirection="column" flex="1" gap="4px" maxWidth="304px" marginLeft="12px">
          <TokenNameWithIcon size="md" token={token} variant="bold" />
          <Flex>
            <CopyButton
              text={
                <Text fontWeight="normal" size="sm">
                  {formattedAddress}
                </Text>
              }
              value={address}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex flex="1" alignSelf="center" gap="4px" gridArea="amount">
        <Text size="md" variant="bold">
          {tokenPrettyAmount(token.balance, token, { showSymbol: false })}
        </Text>
        {/* TODO: implement USD price later */}
        {/* <Text size="sm">{token.price}</Text> */}
      </Flex>
      <SendButton
        justifySelf="end"
        gridArea="action"
        width="fit-content"
        onClick={() => openWith(<SendTokensFormPage sender={account} token={token} />)}
      />
    </Grid>
  );
};
