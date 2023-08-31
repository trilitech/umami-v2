import {
  Box,
  Card,
  Flex,
  Heading,
  Icon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdArrowOutward, MdGeneratingTokens } from "react-icons/md";
import { IconAndTextBtn, IconAndTextBtnLink } from "../../components/IconAndTextBtn";
import { Identicon } from "../../components/Identicon";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { FA12TokenBalance, FA2TokenBalance } from "../../types/TokenBalance";
import { httpIconUri, tokenName, tokenPrettyAmount } from "../../types/Token";
import { formatPkh } from "../../utils/format";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { buildTzktAddressUrl } from "../../utils/tzkt/helpers";
import { DynamicModalContext } from "../../components/DynamicModal";
import SendTokenFormPage from "../../components/SendFlow/Token/FormPage";

const AccountTokensTileHeader: React.FC<{
  pkh: string;
  label: string;
}> = ({ pkh, label }) => (
  <Flex p={4} bg={colors.gray[900]} h={90} borderRadius="8px" alignItems="center">
    <Identicon identiconSize={32} address={pkh} />
    <Flex flex={1} justifyContent="space-between">
      <Box m={4} data-testid="account-identifier">
        <Heading size="md" mb={2}>
          {label}
        </Heading>
        <Flex alignItems="center">
          <Text size="sm" color="text.dark">
            {formatPkh(pkh)}
          </Text>
        </Flex>
      </Box>
    </Flex>
  </Flex>
);

const AccountTokensTile: React.FC<{
  account: Account;
  tokens: (FA12TokenBalance | FA2TokenBalance)[];
}> = ({ account, tokens }) => {
  const network = useSelectedNetwork();
  const { openWith } = useContext(DynamicModalContext);
  const {
    address: { pkh },
    label,
  } = account;
  return (
    <Card m={4} p={5} bgColor={colors.gray[900]} borderRadius="10px">
      <AccountTokensTileHeader pkh={pkh} label={label} />

      <TableContainer
        overflowX="unset"
        overflowY="unset"
        bgColor={colors.gray[900]}
        borderRadius="10px"
      >
        <Table>
          <Thead position="sticky" top={0} zIndex="docked" borderRadius={4}>
            <Tr>
              <Th>Token</Th>
              <Th>Contract:</Th>
              <Th>Balance:</Th>
              <Th>Value in ꜩ:</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tokens.map((token, i) => {
              const iconUri = httpIconUri(token);
              return (
                <Tr key={`${token.contract}${i}`}>
                  <Td w="15%">
                    <Flex alignItems="cnenter">
                      {iconUri ? (
                        <Image src={iconUri} w={8} h={8} />
                      ) : (
                        <Icon h={8} w={8} as={MdGeneratingTokens} />
                      )}

                      <Heading size="sm" p={2} marginX={2}>
                        {tokenName(token)}
                      </Heading>
                    </Flex>
                  </Td>
                  <Td w="15%">
                    <IconAndTextBtnLink
                      label={formatPkh(token.contract)}
                      icon={FiExternalLink}
                      href={buildTzktAddressUrl(network, token.contract)}
                      textFirst
                    />
                  </Td>
                  <Td w="15%">{tokenPrettyAmount(token.balance, token, { showSymbol: false })}</Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="space-between" paddingX={3}>
                      {/* TODO: fetch token values  */}
                      {/* https://app.asana.com/0/1204165186238194/1204627608626297/f */}
                      <Text>≈ 1.0 ꜩ</Text>
                      <IconAndTextBtn
                        icon={MdArrowOutward}
                        label="Send"
                        onClick={() => {
                          openWith(<SendTokenFormPage sender={account} token={token} />);
                        }}
                      />
                    </Flex>
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

export default AccountTokensTile;
