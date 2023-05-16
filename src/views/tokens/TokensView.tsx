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
import { AiOutlineArrowDown } from "react-icons/ai";
import { MdArrowOutward, MdGeneratingTokens } from "react-icons/md";
import { CopyableAddress } from "../../components/CopyableText";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { Identicon } from "../../components/Identicon";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { getTokenPrettyBalance } from "../../types/Asset";
import { formatPkh } from "../../utils/format";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { useGetAccountAllTokens } from "../../utils/hooks/assetsHooks";

export const FilterController: React.FC = () => {
  return (
    <Flex alignItems={"center"} mb={4} mt={4}>
      <TextAndIconBtn
        icon={AiOutlineArrowDown}
        text="Filter by Account"
        onClick={() => {}}
      />
    </Flex>
  );
};

const AccountTokensCardHeader: React.FC<{
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

const AccountTokensCard: React.FC<{ account: Account }> = ({
  account: { pkh, label },
}) => {
  const getTokens = useGetAccountAllTokens();
  const tokens = getTokens(pkh);
  return (
    <Card m={4} p={2} bgColor={colors.gray[900]}>
      <AccountTokensCardHeader pkh={pkh} label={label} />

      <TableContainer overflowX="unset" overflowY="unset">
        <Table>
          {
            // Finally a way to have a sticky Header
            // https://github.com/chakra-ui/chakra-ui/discussions/5656#discussioncomment-3320528
          }
          <Thead
            position="sticky"
            top={0}
            zIndex="docked"
            bg="umami.gray.900"
            borderRadius={4}
          >
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
                <Tr>
                  <Td w="20%">
                    <Flex alignItems="cnenter">
                      {token.metadata?.iconUrl ? (
                        <Image src={token.metadata.iconUrl} w={8} h={8} />
                      ) : (
                        <Icon h={8} w={8} as={MdGeneratingTokens} />
                      )}

                      <Heading size="sm" p={2} marginX={2}>
                        {token.metadata?.name}
                      </Heading>
                    </Flex>
                  </Td>
                  <Td w="20%">
                    <CopyableAddress pkh={token.contract} />
                  </Td>
                  <Td w="20%">
                    {getTokenPrettyBalance(token, { showSymbol: false })}
                  </Td>
                  <Td>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      paddingX={3}
                    >
                      <Text>≈ 1.0 ꜩ</Text>
                      <IconAndTextBtn
                        icon={MdArrowOutward}
                        label="Send"
                        onClick={() => {
                          //   onOpen({
                          //     recipient: contact.pkh,
                          //     mode: { type: "tez" },
                          //   });
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              );
            })}
            {/* {items.map((b, i) => {
              return (
                <Tr
                  // TODO add getKey method
                  key={b.operation.value.sender + b.operation.type + i}
                >
                  <Td>{b.operation.type}</Td>
                  <Td>{renderAmount(b.operation)}</Td>
                  <Td>
                    {b.operation.value.recipient &&
                      formatPkh(b.operation.value.recipient)}
                  </Td>
                  <Td>{prettyTezAmount(b.fee)}</Td>
                </Tr>
              );
            })} */}
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  );
};

const TokensView = () => {
  const accounts = useAccounts();
  return (
    <Flex direction="column" height={"100%"}>
      <TopBar title="Tokens" />
      <FilterController />
      <Box overflow={"scroll"}>
        {accounts.map((account) => (
          <AccountTokensCard account={account} />
        ))}
      </Box>
    </Flex>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default TokensView;
