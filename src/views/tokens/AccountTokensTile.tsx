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
  Th,
  Thead,
  Tr,
  Image,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import { MdArrowOutward, MdGeneratingTokens } from "react-icons/md";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Identicon } from "../../components/Identicon";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { getTokenPrettyBalance } from "../../types/Asset";
import { formatPkh } from "../../utils/format";
import {
  useGetAccountAllTokens,
  useSelectedNetwork,
} from "../../utils/hooks/assetsHooks";
import { Options } from "../home/useSendFormModal";
import { FiExternalLink } from "react-icons/fi";
import { tzktExplorer } from "../../utils/tezos/consts";

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
  account: Account;
  onOpenSendModal: (options?: Options) => void;
}> = ({ account: { pkh, label }, onOpenSendModal }) => {
  const getTokens = useGetAccountAllTokens();
  const tokens = getTokens(pkh);
  const network = useSelectedNetwork();

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
              return (
                <Tr key={`${token.contract}${i}`}>
                  <Td w="15%">
                    <Flex alignItems="cnenter">
                      {token.metadata?.iconUrl ? (
                        <Image src={token.metadata.iconUrl} w={8} h={8} />
                      ) : (
                        <Icon h={8} w={8} as={MdGeneratingTokens} />
                      )}

                      <Heading size="sm" p={2} marginX={2}>
                        {token.metadata?.name || token.type.toUpperCase()}
                      </Heading>
                    </Flex>
                  </Td>
                  <Td w="15%">
                    <TextAndIconBtn
                      text={formatPkh(token.contract)}
                      icon={FiExternalLink}
                      onClick={() => {
                        window.open(
                          `${tzktExplorer[network]}/${token.contract}`,
                          "_blank"
                        );
                      }}
                    />
                  </Td>
                  <Td w="15%">
                    {getTokenPrettyBalance(token, { showSymbol: false })}
                  </Td>
                  <Td>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      paddingX={3}
                    >
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
