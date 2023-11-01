import { AspectRatio, Box, Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { useGetTokenTransfer } from "../../utils/hooks/assetsHooks";
import { TokenTransfer } from "../../types/Transfer";
import { TzktCombinedOperation, TransactionOperation } from "../../utils/tezos";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { thumbnailUri, tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { useIsOwnedAddress } from "../../utils/hooks/accountHooks";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { useShowAddress } from "./useShowAddress";
import AddressPill from "../AddressPill/AddressPill";
import { TransactionTile } from "./TransactionTile";
import { TransactionDirectionIcon } from "./TransactionDirectionIcon";
import { ContractCallTile } from "./ContractCallTile";
import { OriginationTile } from "./OriginationTile";
import { DelegationTile } from "./DelegationTile";

const TokenTransferTile: React.FC<{
  operation: TransactionOperation;
  tokenTransfer: TokenTransfer;
}> = ({ operation, tokenTransfer }) => {
  const tokenId = tokenTransfer.token.tokenId;
  const contract = tokenTransfer.token.contract.address;
  const rawAmount = tokenTransfer.amount;

  const showToAddress = useShowAddress(tokenTransfer.to.address);
  const showFromAddress = useShowAddress(operation.sender.address);
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  const getToken = useGetToken();
  const isOutgoing = useIsOwnedAddress(operation.sender.address);

  const token = getToken(contract, tokenId);
  if (!token) {
    // If we don't have the token yet to present it's fine to fallback to
    // the transaction tile because it is a transaction by nature
    // should be covered by a higher level component to batch the requests
    return <TransactionTile operation={operation} />;
  }
  const isNFT = token.type === "nft";

  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });
  const titleColor = isOutgoing ? colors.orange : colors.green;
  const underlineColor = isNFT ? "white" : titleColor;
  const sign = isOutgoing ? "-" : "+";

  const titleElement = isNFT ? (
    <Tooltip
      bg={colors.gray[700]}
      border="1px solid"
      borderColor={colors.gray[500]}
      borderRadius="8px"
      p="8px"
      label={
        <AspectRatio w="170px" h="170px" ratio={1}>
          <Image src={getIPFSurl(thumbnailUri(token))} />
        </AspectRatio>
      }
    >
      <Flex>
        <TzktLink operation={operation} mr="8px" color={underlineColor}>
          <Text display="inline" fontWeight="600" color={titleColor}>
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
    <TzktLink operation={operation} mr="8px" color={underlineColor}>
      <Text display="inline" fontWeight="600" color={titleColor}>
        {sign}
        {tokenAmount}
      </Text>
    </TzktLink>
  );

  return (
    <Flex direction="column" data-testid="operation-tile" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <TransactionDirectionIcon isOutgoing={isOutgoing} mr="8px" />
          {titleElement}
          <Fee operation={operation} />
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {showToAddress && (
              <Flex mr="15px">
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={tokenTransfer.to} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={operation.sender} />
              </Flex>
            )}
          </Flex>
          <Center>
            <OperationTypeWrapper>Token Transfer</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};

// TODO: Add tests to all of the tiles
export const OperationTile: React.FC<{
  operation: TzktCombinedOperation;
}> = ({ operation }) => {
  const getTokenTransfer = useGetTokenTransfer();

  switch (operation.type) {
    case "transaction": {
      const isContractCall = !!operation.parameter;
      const tokenTransfer = getTokenTransfer(operation.id);

      if (tokenTransfer) {
        return <TokenTransferTile operation={operation} tokenTransfer={tokenTransfer} />;
      } else if (isContractCall) {
        return <ContractCallTile operation={operation} />;
      } else {
        return <TransactionTile operation={operation} />;
      }
    }
    case "delegation":
      return <DelegationTile operation={operation} />;

    case "origination":
      return <OriginationTile operation={operation} />;
  }
};
