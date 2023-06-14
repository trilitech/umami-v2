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
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdArrowOutward, MdGeneratingTokens } from "react-icons/md";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Identicon } from "../../components/Identicon";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import colors from "../../style/colors";
import { AllAccount } from "../../types/Account";
import { httpIconUri, tokenName, tokenPrettyBalance } from "../../types/Asset";
import { formatPkh } from "../../utils/format";
import { navigateToExternalLink } from "../../utils/helpers";
import { useGetAccountAllTokens, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { tzktExplorer } from "../../utils/tezos/consts";
import { Options } from "../home/useSendFormModal";

const AccountTokensTileHeader: React.FC<{
  pkh: string;
  label: string;
}> = ({ pkh, label }) => (
  <Flex p={4} bg="umami.gray.900" h={90} borderRadius="8px" alignItems="center">
    <Identicon address={pkh} />
    <Flex flex={1} justifyContent="space-between">
      <Box m={4} data-testid="account-identifiers">
        <Heading size={"md"} mb={2}>
          {label}
        </Heading>
        <Flex alignItems={"center"}>
          <Text size="sm" color="text.dark">
            {formatPkh(pkh)}
          </Text>
        </Flex>
      </Box>
    </Flex>
  </Flex>
);

const AccountTokensTile: React.FC<{
  account: AllAccount;
  onOpenSendModal: (options?: Options) => void;
}> = ({ account: { pkh, label }, onOpenSendModal }) => {
  const getTokens = useGetAccountAllTokens();
  const network = useSelectedNetwork();
  const tokens = getTokens(pkh);
  if (tokens.length === 0) return null;
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
                    <TextAndIconBtn
                      text={formatPkh(token.contract)}
                      icon={FiExternalLink}
                      onClick={() => {
                        navigateToExternalLink(`${tzktExplorer[network]}/${token.contract}`);
                      }}
                    />
                  </Td>
                  <Td w="15%">{tokenPrettyBalance(token, { showSymbol: false })}</Td>
                  <Td>
                    <Flex alignItems="center" justifyContent="space-between" paddingX={3}>
                      {/* TODO: fetch token values  */}
                      {/* https://app.asana.com/0/1204165186238194/1204627608626297/f */}
                      <Text>≈ 1.0 ꜩ</Text>
                      <IconAndTextBtn
                        icon={MdArrowOutward}
                        label="Send"
                        onClick={() => {
                          onOpenSendModal({
                            sender: pkh,
                            mode: { type: "token", data: token },
                          });
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
