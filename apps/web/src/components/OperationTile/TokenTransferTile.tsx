import {
  AspectRatio,
  Flex,
  type FlexProps,
  Heading,
  Image,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
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
import { memo } from "react";

import { Fee } from "./Fee";
import { InternalPrefix } from "./InternalPrefix";
import { RightBlock } from "./RightBlock";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useOperationColor } from "./useOperationColor";
import { useColor } from "../../styles/useColor";
import { AddressPill } from "../AddressPill/AddressPill";

export const TokenTransferTile = memo(
  ({
    operation,
    tokenTransfer,
    token,
    ...props
  }: {
    // externally originated token transfers
    // do not have a corresponding operation in the list
    // in fact, they might not even have a corresponding transaction
    // they might be initiated by a contract origination instead
    operation?: TransactionOperation;
    tokenTransfer: TokenTransferOperation;
    token: Token;
  } & FlexProps) => {
    const color = useColor();
    const rawAmount = tokenTransfer.amount;

    const operationDestination = useGetOperationDestination(
      tokenTransfer.from?.address,
      tokenTransfer.to?.address
    );
    const isNFT = token.type === "nft";

    const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });

    const titleColor = useOperationColor(operationDestination);
    const underlineColor = isNFT ? color("black") : titleColor;

    const sign = operationSign(operationDestination);

    const titleElement = isNFT ? (
      <Tooltip
        padding="8px"
        background={color("white")}
        border="1px solid"
        borderColor={color("100")}
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
          <InternalPrefix operation={operation || tokenTransfer} />
          <TzktLink
            color={underlineColor}
            data-testid="title"
            migrationId={tokenTransfer.migrationId}
            originationId={tokenTransfer.originationId}
            transactionId={tokenTransfer.transactionId}
          >
            <Heading display="inline" color={titleColor} size="sm">
              {sign}
              {tokenAmount}
            </Heading>
            <Heading display="inline" size="sm">
              {" "}
              {tokenNameSafe(token)}
            </Heading>
          </TzktLink>
        </Flex>
      </Tooltip>
    ) : (
      <Flex>
        <InternalPrefix operation={operation || tokenTransfer} />
        <TzktLink
          color={underlineColor}
          data-testid="title"
          migrationId={tokenTransfer.migrationId}
          originationId={tokenTransfer.originationId}
          transactionId={tokenTransfer.transactionId}
        >
          <Heading display="inline" color={titleColor} size="sm">
            {sign}
            {tokenAmount}
          </Heading>
        </TzktLink>
      </Flex>
    );

    return (
      <Flex
        flexDirection="column"
        gap="10px"
        width="100%"
        data-testid="operation-tile-token-transfer"
        {...props}
      >
        <Wrap spacing="10px">
          <WrapItem>
            <TransactionDirectionIcon marginRight="8px" destination={operationDestination} />
            {titleElement}
          </WrapItem>

          <WrapItem>{operation && <Fee operation={operation} />}</WrapItem>
        </Wrap>

        <Wrap justify="space-between" spacing="10px">
          <WrapItem>
            <Wrap spacing="10px">
              {tokenTransfer.to && (
                <WrapItem data-testid="to">
                  <Text marginRight="6px" color={color("600")}>
                    To:
                  </Text>
                  <AddressPill address={tokenTransfer.to} />
                </WrapItem>
              )}

              {tokenTransfer.from && (
                <WrapItem data-testid="from">
                  <Text marginRight="6px" color={color("600")}>
                    From:
                  </Text>
                  <AddressPill address={tokenTransfer.from} />
                </WrapItem>
              )}
            </Wrap>
          </WrapItem>

          <WrapItem alignItems="center">
            <RightBlock
              level={tokenTransfer.level}
              operationType="Token Transfer"
              status={operation?.status}
              timestamp={tokenTransfer.timestamp}
            />
          </WrapItem>
        </Wrap>
      </Flex>
    );
  }
);
