import { AspectRatio, Flex, type FlexProps, Heading, Image, Tooltip } from "@chakra-ui/react";
import {
  type Token,
  operationSign,
  thumbnailUri,
  tokenNameSafe,
  tokenPrettyAmount,
} from "@umami/core";
import { type OperationDestination, useGetOperationDestination } from "@umami/state";
import { getIPFSurl } from "@umami/tezos";
import { type TokenTransferOperation, type TransactionOperation } from "@umami/tzkt";

import { OperationTileView } from "./OperationTileView";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { TzktLink } from "./TzktLink";
import { useFee } from "./useFee";
import { useOperationColor } from "./useOperationColor";
import { useOperationStatus } from "./useOperationStatus";
import { useColor } from "../../styles/useColor";

export const TokenTransferTile = ({
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
  const fee = useFee(operation);
  const status = useOperationStatus(tokenTransfer.level, operation?.status);

  const destination = useGetOperationDestination(
    operation?.sender.address || tokenTransfer.from?.address,
    operation?.target?.address || tokenTransfer.to?.address
  );

  const rawAmount = tokenTransfer.amount;
  const amount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });

  const title = (
    <TokenTransferTileTitle
      amount={amount}
      destination={destination}
      migrationId={tokenTransfer.migrationId}
      originationId={tokenTransfer.originationId}
      token={token}
      transactionId={tokenTransfer.transactionId}
    />
  );

  return (
    <OperationTileView
      data-testid="operation-tile-token-transfer"
      destination={destination}
      fee={fee}
      from={tokenTransfer.from}
      icon={<TransactionDirectionIcon marginRight="8px" destination={destination} />}
      operationType="Token Transfer"
      status={status}
      timestamp={tokenTransfer.timestamp}
      title={title}
      to={tokenTransfer.to}
      {...props}
    />
  );
};

export const TokenTransferTileTitle = ({
  token,
  amount,
  destination,
  transactionId,
  originationId,
  migrationId,
}: {
  token: Token;
  amount: string;
  destination: OperationDestination;
  transactionId?: number;
  originationId?: number;
  migrationId?: number;
}) => {
  const color = useColor();
  const titleColor = useOperationColor(destination);
  const isNFT = token.type === "nft";

  const underlineColor = isNFT ? color("black") : titleColor;
  const sign = operationSign(destination);

  return isNFT ? (
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
        <TzktLink
          color={underlineColor}
          data-testid="title"
          migrationId={migrationId}
          originationId={originationId}
          transactionId={transactionId}
        >
          <Heading display="inline" color={titleColor} size="sm">
            {sign}
            {amount}
          </Heading>
          <Heading display="inline" size="sm">
            {" "}
            {tokenNameSafe(token)}
          </Heading>
        </TzktLink>
      </Flex>
    </Tooltip>
  ) : (
    <TzktLink
      color={underlineColor}
      data-testid="title"
      migrationId={migrationId}
      originationId={originationId}
      transactionId={transactionId}
    >
      <Heading display="inline" color={titleColor} size="sm">
        {sign}
        {amount}
      </Heading>
    </TzktLink>
  );
};
