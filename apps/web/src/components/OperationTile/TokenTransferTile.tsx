import { AspectRatio, Box, Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import {
  type Token,
  operationSign,
  thumbnailUri,
  tokenNameSafe,
  tokenPrettyAmount,
} from "@umami/core";
import { useGetOperationDestination } from "@umami/state";
import { getIPFSurl } from "@umami/tezos";
import { type TokenTransferOperation, type TransactionOperation } from "@umami/tzkt";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { useOperationColor } from "./operationColor";
import { OperationStatus } from "./OperationStatus";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { Timestamp } from "./Timestamp";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const TokenTransferTile = ({
  operation,
  tokenTransfer,
  token,
}: {
  // externally originated token transfers
  // do not have a corresponding operation in the list
  // in fact, they might not even have a corresponding transaction
  // they might be initiated by a contract origination instead
  operation?: TransactionOperation;
  tokenTransfer: TokenTransferOperation;
  token: Token;
}) => {
  const color = useColor();
  const rawAmount = tokenTransfer.amount;

  const operationDestination = useGetOperationDestination(
    tokenTransfer.from?.address,
    tokenTransfer.to?.address
  );
  const isNFT = token.type === "nft";

  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });

  const titleColor = useOperationColor(operationDestination);
  const underlineColor = isNFT ? "white" : titleColor;

  const sign = operationSign(operationDestination);

  const titleElement = isNFT ? (
    <Tooltip
      padding="8px"
      background={color("gray.700")}
      border="1px solid"
      borderColor={color("gray.500")}
      borderRadius="8px"
      data-testid="nft-tooltip"
      label={
        <AspectRatio width="170px" height="170px" ratio={1}>
          <Image src={getIPFSurl(thumbnailUri(token))} />
        </AspectRatio>
      }
      openDelay={300}
    >
      <Center>
        <InternalPrefix operation={operation || tokenTransfer} />
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
      </Center>
    </Tooltip>
  ) : (
    <Center>
      <InternalPrefix operation={operation || tokenTransfer} />
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
    </Center>
  );

  return (
    <Flex flexDirection="column" width="100%" data-testid="operation-tile-token-transfer">
      <Flex justifyContent="space-between" marginBottom="10px">
        <Center>
          <TransactionDirectionIcon marginRight="8px" destination={operationDestination} />
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
            {tokenTransfer.to && (
              <Flex marginRight="15px" data-testid="to">
                <Text marginRight="6px" color={color("gray.450")}>
                  To:
                </Text>
                <AddressPill address={tokenTransfer.to} />
              </Flex>
            )}
            {tokenTransfer.from && (
              <Flex data-testid="from">
                <Text marginRight="6px" color={color("gray.450")}>
                  From:
                </Text>
                <AddressPill address={tokenTransfer.from} />
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
