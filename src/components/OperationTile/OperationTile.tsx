import {
  AspectRatio,
  Box,
  Center,
  Flex,
  Heading,
  IconProps,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { useGetTokenTransfer } from "../../utils/hooks/assetsHooks";
import { TokenTransfer } from "../../types/Transfer";
import {
  TzktCombinedOperation,
  TransactionOperation,
  DelegationOperation,
  OriginationOperation,
} from "../../utils/tezos";
import { parsePkh } from "../../types/Address";
import { prettyTezAmount } from "../../utils/format";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { thumbnailUri, tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { CODE_HASH, TYPE_HASH } from "../../utils/multisig/fetch";
import BakerIcon from "../../assets/icons/Baker";
import IncomingArrow from "../../assets/icons/IncomingArrow";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";
import Contract from "../../assets/icons/Contract";
import { Fee } from "./Fee";
import { OperationStatus } from "./OperationStatus";
import { Timestamp } from "./Timestamp";
import { TzktLink } from "./TzktLink";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { useIsOwnedAddress } from "../../utils/hooks/accountHooks";
import { OperationTypeWrapper } from "./OperationTypeWrapper";
import { useShowAddress } from "./useShowAddress";
import AddressPill from "../AddressPill/AddressPill";

const TransactionTile: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const isOutgoing = useIsOwnedAddress(operation.sender.address);
  const amount = prettyTezAmount(String(operation.amount));
  const showToAddress = useShowAddress(operation.target.address);
  const showFromAddress = useShowAddress(operation.sender.address);
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  const titleColor = isOutgoing ? colors.orange : colors.green;
  const sign = isOutgoing ? "-" : "+";

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <TransactionDirectionIcon isOutgoing={isOutgoing} mr="8px" />
          <TzktLink operation={operation} mr="8px" color={titleColor}>
            <Text fontWeight="600" size="sm" color={titleColor}>
              {sign} {amount}
            </Text>
          </TzktLink>
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
                <AddressPill address={parsePkh(operation.target.address)} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationTypeWrapper>Transaction</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const TransactionDirectionIcon = ({
  isOutgoing,
  ...props
}: { isOutgoing: boolean } & IconProps) => {
  return isOutgoing ? <OutgoingArrow {...props} /> : <IncomingArrow {...props} />;
};

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
          <Text display="inline" fontWeight="600" size="sm" color={titleColor}>
            {sign} {tokenAmount}
          </Text>
          <Text display="inline" fontWeight="600" size="sm">
            {" "}
            {tokenNameSafe(token)}
          </Text>
        </TzktLink>
      </Flex>
    </Tooltip>
  ) : (
    <TzktLink operation={operation} mr="8px" color={underlineColor}>
      <Text display="inline" fontWeight="600" size="sm" color={titleColor}>
        {sign} {tokenAmount}
      </Text>
    </TzktLink>
  );

  return (
    <Flex direction="column" w="100%">
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
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={parsePkh(tokenTransfer.to.address)} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
          </Flex>
          <Center alignSelf="flex-end">
            <OperationTypeWrapper>Token Transfer</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Center>
        </Flex>
      </Box>
    </Flex>
  );
};

const ContractCallTile: React.FC<{
  operation: TransactionOperation;
}> = ({ operation }) => {
  const showToAddress = useShowAddress(operation.target.address);
  const showFromAddress = useShowAddress(operation.sender.address);
  // if you send assets between your own accounts you need to see at least one address
  const showAnyAddress = !showToAddress && !showFromAddress;

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <Contract mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">Contract Call: {operation.parameter?.entrypoint}</Heading>
          </TzktLink>
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
                <AddressPill address={parsePkh(operation.target.address)} />
              </Flex>
            )}
            {(showFromAddress || showAnyAddress) && (
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationTypeWrapper>Contract Call</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const DelegationTile: React.FC<{ operation: DelegationOperation }> = ({ operation }) => {
  const isDelegating = !!operation.newDelegate;
  const operationType = isDelegating ? "Delegate" : "Delegation Ended";
  const showFromAddress = useShowAddress(operation.sender.address);

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <BakerIcon stroke={colors.gray[450]} mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">{operationType}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {isDelegating && (
              <Flex mr="15px">
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
                <AddressPill address={parsePkh(operation.newDelegate?.address as string)} />
              </Flex>
            )}
            {showFromAddress && (
              <Flex>
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
            {!isDelegating && !showFromAddress && <Text color={colors.gray[450]}>N/A</Text>}
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationTypeWrapper>{operationType}</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const OriginationTile: React.FC<{ operation: OriginationOperation }> = ({ operation }) => {
  const isMultisig =
    operation.originatedContract?.codeHash === CODE_HASH &&
    operation.originatedContract.typeHash === TYPE_HASH;

  const contractTitle = isMultisig ? "Multisig Account Created" : "Contract Origination";

  const showFromAddress = useShowAddress(operation.sender.address);

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Center>
          <Contract mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">{contractTitle}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Center>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            {!showFromAddress ? (
              <Text color={colors.gray[450]}>N/A</Text>
            ) : (
              <Flex mr="15px">
                <Text mr="6px" color={colors.gray[450]}>
                  From:
                </Text>
                <AddressPill address={parsePkh(operation.sender.address)} />
              </Flex>
            )}
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationTypeWrapper>Contract Origination</OperationTypeWrapper>
            <OperationStatus operation={operation} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

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
