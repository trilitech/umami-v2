import {
  AspectRatio,
  Box,
  Center,
  Flex,
  FlexProps,
  Heading,
  IconProps,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { PropsWithChildren, useContext } from "react";
import colors from "../../style/colors";
import { useGetTokenTransfer } from "../../utils/hooks/assetsHooks";
import { TokenTransfer } from "../../types/Transfer";
import AddressPill from "../AddressPill/AddressPill";
import {
  TzktCombinedOperation,
  TransactionOperation,
  DelegationOperation,
  OriginationOperation,
} from "../../utils/tezos";
import { Address, RawPkh, parsePkh } from "../../types/Address";
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
import { OperationType } from "./OperationType";
import { OperationTileContext } from "./OperationTileContext";

// It won't show the address pill if the address in it
// is the one that is selected in the drawer
const AddressPillWrapper: React.FC<PropsWithChildren<{ address: Address } & FlexProps>> = ({
  children,
  address,
  ...props
}) => {
  const { selectedAddress } = useContext(OperationTileContext);
  if (selectedAddress?.pkh === address.pkh) {
    return null;
  }
  return (
    <Flex {...props}>
      {children}
      <AddressPill address={address} />
    </Flex>
  );
};

const TransactionTile: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const isOutgoing = useIsOwnedAddress(operation.sender?.address as string); // TODO: use zod
  const amount = prettyTezAmount(String(operation.amount));

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
            {/* TODO: use zod */}
            <AddressPillWrapper mr="15px" address={parsePkh(operation.target?.address as string)}>
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
            </AddressPillWrapper>
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.sender?.address as string)}>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
            </AddressPillWrapper>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationType>Transaction</OperationType>
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
  const tokenId = tokenTransfer.token.tokenId as string; // TODO: use zod
  const contract = tokenTransfer.token.contract.address as RawPkh; // TODO: use zod
  const rawAmount = tokenTransfer.amount as string; // TODO: use zod

  const getToken = useGetToken();
  const isOutgoing = useIsOwnedAddress(operation.sender?.address as string); // TODO: use zod

  const token = getToken(contract, tokenId);
  if (!token) {
    // If we don't have the token yet to present it's fine to fallback to
    // the transaction tile because it is a transaction by nature
    // TODO: add an effect to fetch it in the background
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
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(tokenTransfer.to?.address as string)} mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
            </AddressPillWrapper>
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.sender?.address as string)}>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
            </AddressPillWrapper>
          </Flex>
          <Center alignSelf="flex-end">
            <OperationType>Token Transfer</OperationType>
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
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.target?.address as string)} mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
            </AddressPillWrapper>
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.sender?.address as string)}>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
            </AddressPillWrapper>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationType>Contract Call</OperationType>
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
              <AddressPillWrapper
                // TODO: use zod
                address={parsePkh(operation.newDelegate?.address as string)}
                mr="15px"
              >
                <Text mr="6px" color={colors.gray[450]}>
                  To:
                </Text>
              </AddressPillWrapper>
            )}
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.sender?.address as string)}>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
            </AddressPillWrapper>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationType>{operationType}</OperationType>
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
            {/* TODO: use zod */}
            <AddressPillWrapper address={parsePkh(operation.sender?.address as string)} mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
            </AddressPillWrapper>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <OperationType>Contract Origination</OperationType>
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
      const tokenTransfer = getTokenTransfer(operation.id as number); // TODO: use zod

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
