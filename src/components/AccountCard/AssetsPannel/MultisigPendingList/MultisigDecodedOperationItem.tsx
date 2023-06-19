import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FiArrowUpRight } from "react-icons/fi";
import { Operation } from "../../../../multisig/types";
import colors from "../../../../style/colors";
import { Asset, FA12Token, FA2Token, formatTokenAmount } from "../../../../types/Asset";
import { prettyTezAmount } from "../../../../utils/format";
import { CopyableAddress } from "../../../CopyableText";

const MultisigDecodedOperationItem: React.FC<{
  operation: Operation;
  assets: Record<string, Asset[] | undefined>;
}> = ({ operation, assets }) => {
  switch (operation.type) {
    case "delegation":
      return (
        <Box marginY={6} pl={5} m={1} data-testid="decoded-item-delegate">
          {operation.recipient ? `Delegate to ${operation.recipient}` : "Undelegate"}
        </Box>
      );
    default:
      return (
        <Box marginY={6}>
          <MultisigOperationAmount operation={operation} assets={assets} />
          <Flex alignItems="center" pl={5} m={1}>
            <Heading color={colors.gray[400]} size="sm" mr={1}>
              Send to :
            </Heading>
            <CopyableAddress pkh={operation.recipient} iconColor={colors.gray[500]} />
          </Flex>
        </Box>
      );
  }
};

export const searchFAToken = (
  operation: Operation,
  assets: (FA2Token | FA12Token)[]
): Asset | undefined => {
  switch (operation.type) {
    case "fa1.2":
      return assets.find(token => token.contract === operation.contract);
    case "fa2":
      return assets.find(
        token =>
          token.contract === operation.contract && (token as FA2Token).tokenId === operation.tokenId
      );
    default:
      return undefined;
  }
};

const MultisigOperationAmount: React.FC<{
  operation: Operation;
  assets: Record<string, Asset[] | undefined>;
}> = ({ operation, assets }) => {
  switch (operation.type) {
    case "tez":
      return (
        <Flex alignItems="center" data-testid="decoded-tez-amount">
          <Icon h={5} w={5} as={FiArrowUpRight} color={colors.gray[400]}></Icon>
          <Text textAlign="center" ml={1}>
            -{prettyTezAmount(operation.amount)}
          </Text>
        </Flex>
      );
    case "fa1.2":
    case "fa2": {
      const ownedTokens = assets[operation.contract];

      if (!ownedTokens) {
        return null;
      }

      const token = searchFAToken(
        operation,
        ownedTokens.map(t => {
          if (t.type === "fa1.2") {
            return t as FA12Token;
          }
          return t as FA2Token;
        })
      );

      if (!token) {
        return null;
      }
      const symbol = token.metadata?.symbol ?? operation.type;
      const decimals = token.metadata?.decimals;
      const name = token.metadata?.name;
      const isNFT = !!token.metadata?.displayUri;

      return (
        <Flex alignItems="center" data-testid="deocded-fa-amount">
          <Icon h={5} w={5} as={FiArrowUpRight} color={colors.gray[400]}></Icon>
          {isNFT ? (
            <Text textAlign="center" ml={1}>
              {operation.amount} {name}
            </Text>
          ) : (
            <Text textAlign="center" ml={1}>
              -{formatTokenAmount(operation.amount, decimals)} {symbol}
            </Text>
          )}
        </Flex>
      );
    }
    case "delegation":
      return null;
  }
};

export default MultisigDecodedOperationItem;
