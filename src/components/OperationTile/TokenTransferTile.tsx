import { AspectRatio, Box, Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";

import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useIsOutgoingOperation } from "./useIsOutgoingOperation";
import { useShowAddress } from "./useShowAddress";
import colors from "../../style/colors";
import { TzktAlias } from "../../types/Address";
import { Token, thumbnailUri, tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { TokenTransfer } from "../../types/Transfer";
import { TransactionOperation } from "../../utils/tezos";
import { getIPFSurl } from "../../utils/token/utils";
import { AddressPill } from "../AddressPill/AddressPill";

export const TokenTransferTile: React.FC<{
  // externally originated token transfers
  // do not have a corresponding operation in the list
  // in fact, they might not even have a corresponding transaction
  // they might be initiated by a contract origination instead
  operation?: TransactionOperation;
  tokenTransfer: TokenTransfer;
  token: Token;
}> = ({ operation, tokenTransfer, token }) => {
  const rawAmount = tokenTransfer.amount;

  const showToAddress = useShowAddress(tokenTransfer.to.address);
  const showFromAddress = useShowAddress(tokenTransfer.from?.address ?? "");
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  const isOutgoing = useIsOutgoingOperation(tokenTransfer.from?.address ?? "");
  const isNFT = token.type === "nft";

  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });
  const titleColor = isOutgoing ? colors.orange : colors.green;
  const underlineColor = isNFT ? "white" : titleColor;
  const sign = isOutgoing ? "-" : "+";

  const titleElement = isNFT ? (
    <Tooltip
      padding="8px"
      background={colors.gray[700]}
      border="1px solid"
      borderColor={colors.gray[500]}
      borderRadius="8px"
      data-testid="nft-tooltip"
      label={
        <AspectRatio width="170px" height="170px" ratio={1}>
          <Image src={getIPFSurl(thumbnailUri(token))} />
        </AspectRatio>
      }
      openDelay={300}
    >
      <Flex>
        <TzktLink
          marginRight="8px"
          color={underlineColor}
          data-testid="title"
          migrationId={tokenTransfer.migrationId}
          originationId={tokenTransfer.originationId}
          transactionId={tokenTransfer.transactionId}
        >
          <Text display="inline" color={titleColor} fontWeight="600">
            {sign}
            {tokenAmount}
          </Text>
          <Text display="inline" fontWeight="600">
            {" "}
            {tokenNameSafe(token)}
          </Text>
        </TzktLink>
      </Flex>
    </Tooltip>
  ) : (
    <TzktLink
      marginRight="8px"
      color={underlineColor}
      data-testid="title"
      migrationId={tokenTransfer.migrationId}
      originationId={tokenTransfer.originationId}
      transactionId={tokenTransfer.transactionId}
    >
      <Text display="inline" color={titleColor} fontWeight="600">
        {sign}
        {tokenAmount}
      </Text>
    </TzktLink>
  );

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-token-transfer">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <TransactionDirectionIcon marginRight="8px" isOutgoing={isOutgoing} />
          {titleElement}
          {operation && <Fee operation={operation} />}
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={tokenTransfer.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {(showToAddress || showAnyAddress) && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={tokenTransfer.to} />
              </Flex>
            )}
            {showFromAddress && (
              <Flex data-testid="from">
                <Text marginRight="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={tokenTransfer.from as TzktAlias} />
              </Flex>
            )}
          </Flex>
          <Center>
            <OperationTypeWrapper>Token Transfer</OperationTypeWrapper>
            <OperationStatus level={tokenTransfer.level} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};
