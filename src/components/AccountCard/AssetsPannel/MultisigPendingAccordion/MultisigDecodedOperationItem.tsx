import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { FiArrowUpRight } from "react-icons/fi";
import { RawOperation } from "../../../../types/RawOperation";
import colors from "../../../../style/colors";
import {
  formatTokenAmount,
  tokenDecimal,
  tokenName,
  tokenSymbol,
} from "../../../../types/TokenBalance";
import { prettyTezAmount } from "../../../../utils/format";
import { useSearchAsset } from "../../../../utils/hooks/assetsHooks";
import { CopyableAddress } from "../../../CopyableText";

const MultisigDecodedOperationItem: React.FC<{
  operation: RawOperation;
}> = ({ operation }) => {
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
          <MultisigOperationAmount operation={operation} />
          <Flex alignItems="center" pl={5} m={1}>
            <Heading color={colors.gray[400]} size="sm" mr={1}>
              Send to :
            </Heading>
            <CopyableAddress pkh={operation.recipient.pkh} iconColor={colors.gray[500]} />
          </Flex>
        </Box>
      );
  }
};

const MultisigOperationAmount: React.FC<{
  operation: RawOperation;
}> = ({ operation }) => {
  const searchAsset = useSearchAsset();
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
      const asset = searchAsset(operation.contract.pkh, operation.tokenId);

      if (!asset) {
        return null;
      }
      const symbol = tokenSymbol(asset);
      const decimals = tokenDecimal(asset);
      const name = tokenName(asset);
      const isNFT = asset.type === "nft";

      return (
        <Flex alignItems="center" data-testid="decoded-fa-amount">
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
