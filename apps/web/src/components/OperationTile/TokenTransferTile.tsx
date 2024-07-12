import { AspectRatio, Flex, type FlexProps, Heading, Image, Tooltip } from "@chakra-ui/react";
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
  const color = useColor();
  const fee = useFee(operation);
  const status = useOperationStatus(tokenTransfer.level, operation?.status);
  const rawAmount = tokenTransfer.amount;

  const destination = useGetOperationDestination(
    operation?.sender.address || tokenTransfer.from?.address,
    operation?.target?.address || tokenTransfer.to?.address
  );
  const isNFT = token.type === "nft";

  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });

  const titleColor = useOperationColor(destination);
  const underlineColor = isNFT ? color("black") : titleColor;

  const sign = operationSign(destination);

  const title = isNFT ? (
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
