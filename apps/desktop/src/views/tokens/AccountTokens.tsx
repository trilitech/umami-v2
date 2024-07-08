import {
  Box,
  Card,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import {
  type Account,
  type FA12TokenBalance,
  type FA2TokenBalance,
  fullId,
  tokenPrettyAmount,
} from "@umami/core";
import { formatPkh, parseContractPkh } from "@umami/tezos";
import { useContext } from "react";

import { TokenNameWithIcon } from "./TokenNameWithIcon";
import { TokenIcon } from "../../assets/icons";
import { AccountBalance } from "../../components/AccountBalance";
import { accountIconGradient } from "../../components/AccountTile/AccountTile";
import { AccountTileIcon } from "../../components/AccountTile/AccountTileIcon";
import { AddressPill } from "../../components/AddressPill/AddressPill";
import { SendButton } from "../../components/SendButton";
import { FormPage as SendTokenFormPage } from "../../components/SendFlow/Token/FormPage";
import colors from "../../style/colors";

const Header = ({ account }: { account: Account }) => {
  const { address, label } = account;
  return (
    <Flex
      alignItems="center"
      height="78px"
      background={accountIconGradient({
        left: "-10px",
        top: "-10px",
        account,
        radius: "100px",
        mainBackgroundColor: colors.gray[800],
      })}
      borderTopRadius="8px"
      data-testid="header"
      paddingX="30px"
    >
      <AccountTileIcon account={account} size="lg" />

      <Flex justifyContent="space-between" flex={1}>
        <Box marginLeft="16px" data-testid="account-identifier">
          <Heading marginBottom="4px" size="md">
            {label}
          </Heading>
          <Text color={colors.gray[300]} size="sm">
            {formatPkh(address.pkh)}
          </Text>
        </Box>
        <Flex flexDirection="column-reverse">
          <AccountBalance verticalAlign="bottom" address={account.address.pkh} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const AccountTokens = ({
  account,
  tokens,
}: {
  account: Account;
  tokens: (FA12TokenBalance | FA2TokenBalance)[];
}) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Card
      overflowX="auto"
      marginBottom="16px"
      borderBottomRadius="8px"
      backgroundColor={colors.gray[900]}
    >
      <Header account={account} />
      <TableContainer paddingX="30px">
        <Table>
          <Tbody>
            {tokens.map((token, i) => {
              const rowBorderColor = i === tokens.length - 1 ? "transparent" : colors.gray[700];
              return (
                <Tr key={fullId(token)} data-testid="token-tile">
                  <Td width="20%" minWidth="240px" borderColor={rowBorderColor} paddingX="0">
                    <Flex alignItems="center">
                      <TokenIcon display="inline-block" width="38px" contract={token.contract} />
                      <Heading display="inline-block" marginLeft="16px" size="sm">
                        <TokenNameWithIcon token={token} />
                      </Heading>
                    </Flex>
                  </Td>
                  <Td width="20%" minWidth="200px" borderColor={rowBorderColor} paddingX="0">
                    <AddressPill address={parseContractPkh(token.contract)} />
                  </Td>
                  <Td width="15%" minWidth="160px" borderColor={rowBorderColor} paddingX="0">
                    <Heading size="sm">
                      {tokenPrettyAmount(token.balance, token, { showSymbol: false })}
                    </Heading>
                  </Td>
                  <Td textAlign="right" borderColor={rowBorderColor} paddingX="0">
                    <SendButton
                      onClick={() => openWith(<SendTokenFormPage sender={account} token={token} />)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};
