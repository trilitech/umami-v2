import {
  Box,
  Button,
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
import React, { useContext } from "react";
import { Identicon } from "../../components/Identicon";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance } from "../../types/TokenBalance";
import { fullId, tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { formatPkh } from "../../utils/format";
import { DynamicModalContext } from "../../components/DynamicModal";
import SendTokenFormPage from "../../components/SendFlow/Token/FormPage";
import TokenIcon from "../../assets/icons/Token";
import { AccountBalance } from "../../components/AccountBalance";
import AddressPill from "../../components/AddressPill/AddressPill";
import { parseContractPkh } from "../../types/Address";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";

const Header: React.FC<{
  account: Account;
}> = ({ account }) => {
  const {
    address: { pkh },
    label,
  } = account;

  return (
    <Flex
      data-testid="header"
      paddingX="30px"
      bg={colors.gray[800]}
      height="78px"
      borderTopRadius="8px"
      alignItems="center"
    >
      <Identicon p="8px" identiconSize={32} address={pkh} />
      <Flex flex={1} justifyContent="space-between">
        <Box ml="16px" data-testid="account-identifier">
          <Heading size="md" mb="4px">
            {label}
          </Heading>
          <Text size="sm" color={colors.gray[300]}>
            {formatPkh(pkh)}
          </Text>
        </Box>
        <Flex flexDirection="column-reverse">
          <AccountBalance verticalAlign="bottom" address={account.address.pkh} />
        </Flex>
      </Flex>
    </Flex>
  );
};

const AccountTokens: React.FC<{
  account: Account;
  tokens: (FA12TokenBalance | FA2TokenBalance)[];
}> = ({ account, tokens }) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Card mb="16px" bgColor={colors.gray[900]} borderBottomRadius="8px" overflowX="auto">
      <Header account={account} />
      <TableContainer paddingX="30px">
        <Table>
          <Tbody>
            {tokens.map((token, i) => {
              const rowBorderColor = i === tokens.length - 1 ? "transparent" : colors.gray[700];
              return (
                <Tr key={fullId(token)} data-testid="token-tile">
                  <Td paddingX="0" minWidth="240px" borderColor={rowBorderColor}>
                    <Flex alignItems="center">
                      <TokenIcon display="inline-block" contract={token.contract} width="38px" />
                      <Heading display="inline-block" size="sm" marginLeft="16px">
                        {tokenNameSafe(token)}
                      </Heading>
                    </Flex>
                  </Td>
                  <Td paddingX="0" minWidth="200px" borderColor={rowBorderColor}>
                    <AddressPill address={parseContractPkh(token.contract)} />
                  </Td>
                  <Td paddingX="0" minWidth="160px" borderColor={rowBorderColor}>
                    <Heading size="sm">
                      {tokenPrettyAmount(token.balance, token, { showSymbol: false })}
                    </Heading>
                  </Td>
                  <Td textAlign="right" paddingX="0" borderColor={rowBorderColor}>
                    <Button
                      variant="specialCTA"
                      width="60px"
                      color={colors.greenL}
                      onClick={() => {
                        openWith(<SendTokenFormPage sender={account} token={token} />);
                      }}
                    >
                      <OutgoingArrow stroke="currentcolor" />
                      <Text ml="4px">Send</Text>
                    </Button>
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

export default AccountTokens;
