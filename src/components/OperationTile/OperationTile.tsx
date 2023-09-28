import { Box, Flex, Heading, Link, LinkProps, Text } from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { useGetTokenTransfer, useIsBlockFinalised } from "../../utils/hooks/assetsHooks";
import { TokenTransfer } from "../../types/Transfer";
import { getHashUrl } from "../../views/operations/operationsUtils";
import AddressPill from "../AddressPill/AddressPill";
import {
  TzktCombinedOperation,
  TransactionOperation,
  DelegationOperation,
  OriginationOperation,
} from "../../utils/tezos";
import { RawPkh, parsePkh } from "../../types/Address";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { formatRelative } from "date-fns";
import { prettyTezAmount } from "../../utils/format";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { tokenNameSafe, tokenPrettyAmount } from "../../types/Token";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import CheckmarkIcon from "../../assets/icons/Checkmark";
import CrossedCircleIcon from "../../assets/icons/CrossedCircle";
import HourglassIcon from "../../assets/icons/Hourglass";
import { CODE_HASH, TYPE_HASH } from "../../utils/multisig/fetch";
import BakerIcon from "../../assets/icons/Baker";
import IncomingArrow from "../../assets/icons/IncomingArrow";
import OutgoingArrow from "../../assets/icons/OutgoingArrow";
import Contract from "../../assets/icons/Contract";
import { Fee } from "./Fee";

// TODO: add smaller version for the drawer without fee, transaction type, from/to based on the current selected account

const TzktLink: React.FC<
  React.PropsWithChildren<{ operation: TzktCombinedOperation } & LinkProps>
> = ({ operation, children, ...props }) => {
  const network = useSelectedNetwork();
  const url = getHashUrl({
    hash: operation.hash as string, // TODO: use zod
    counter: operation.counter as number, // TODO: use zod
    network,
  });
  return (
    <Link href={url} isExternal {...props}>
      {children}
    </Link>
  );
};

const OperationStatus: React.FC<{ operation: TzktCombinedOperation }> = ({ operation }) => {
  const isFinalised = useIsBlockFinalised(operation.level as number); // TODO: use zod

  if (operation.status === "applied") {
    if (isFinalised) {
      return <CheckmarkIcon />;
    } else {
      return <HourglassIcon />;
    }
  }
  return <CrossedCircleIcon />;
};

export const useIsIncomingOperation = (operation: TransactionOperation) => {
  const ownedAccounts = useAllAccounts();
  return ownedAccounts.map(acc => acc.address.pkh).includes(operation.target?.address as string);
};

const Timestamp: React.FC<{ timestamp: string | undefined }> = ({ timestamp }) => {
  if (!timestamp) {
    return null;
  }
  const relativeTimestamp = formatRelative(new Date(timestamp as string), new Date());
  return <Text color={colors.gray[400]}>{relativeTimestamp}</Text>;
};

const TransactionTile: React.FC<{ operation: TransactionOperation }> = ({ operation }) => {
  const isIncoming = useIsIncomingOperation(operation);
  const amount = prettyTezAmount(String(operation.amount));

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Flex align="center">
          {isIncoming ? (
            <>
              <IncomingArrow mr="8px" />
              <TzktLink operation={operation} mr="8px">
                <Text fontWeight="600" size="sm" color={colors.green}>
                  + {amount}
                </Text>
              </TzktLink>
            </>
          ) : (
            <>
              <OutgoingArrow mr="8px" />
              <TzktLink operation={operation} mr="8px">
                <Text fontWeight="600" size="sm" color={colors.orange}>
                  - {amount}
                </Text>
              </TzktLink>
            </>
          )}
          <Fee operation={operation} />
        </Flex>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            <Flex mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.target?.address as string)} />
            </Flex>
            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <Text color={colors.gray[300]} mr="4px">
              Transaction
            </Text>
            <OperationStatus operation={operation} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const TokenTransferTile: React.FC<{
  operation: TransactionOperation;
  tokenTransfer: TokenTransfer;
}> = ({ operation, tokenTransfer }) => {
  const tokenId = tokenTransfer.token.tokenId as string; // TODO: use zod
  const contract = tokenTransfer.token.contract.address as RawPkh; // TODO: use zod
  const rawAmount = tokenTransfer.amount as string; // TODO: use zod

  const getToken = useGetToken();
  const isIncoming = useIsIncomingOperation(operation);

  const token = getToken(contract, tokenId);
  if (!token) {
    // If we don't have the token yet to present it's fine to fallback to
    // the transaction tile because it is a transaction by nature
    return <TransactionTile operation={operation} />;
  }
  const tokenAmount = tokenPrettyAmount(rawAmount, token, { showSymbol: true });

  const tokenNameElement = (
    <Text display="inline" fontWeight="600" size="sm">
      {" "}
      {tokenNameSafe(token)}
    </Text>
  );

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Flex align="center">
          {isIncoming ? (
            <>
              <IncomingArrow mr="8px" />
              <TzktLink operation={operation} mr="8px">
                <Text display="inline" fontWeight="600" size="sm" color={colors.green}>
                  + {tokenAmount}
                </Text>
                {token.type === "nft" && tokenNameElement}
              </TzktLink>
            </>
          ) : (
            <>
              <OutgoingArrow mr="8px" />
              <TzktLink operation={operation} mr="8px">
                <Text display="inline" fontWeight="600" size="sm" color={colors.orange}>
                  - {tokenAmount}
                </Text>
                {token.type === "nft" && tokenNameElement}
              </TzktLink>
            </>
          )}

          <Fee operation={operation} />
        </Flex>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            <Flex mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
              {/* TODO: use zod */}

              <AddressPill address={parsePkh(tokenTransfer.to?.address as string)} />
            </Flex>
            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
              {/* TODO: use zod */}

              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <Text color={colors.gray[300]} mr="4px">
              Token Transfer
            </Text>
            <OperationStatus operation={operation} />
          </Flex>
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
        <Flex align="center">
          <Contract mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">Contract Call: {operation.parameter?.entrypoint}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Flex>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            <Flex mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.target?.address as string)} />
            </Flex>
            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <Text color={colors.gray[300]} mr="4px">
              Contract Call
            </Text>
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
        <Flex align="center">
          <BakerIcon stroke={colors.gray[450]} mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">{operationType}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Flex>
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
            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <Text color={colors.gray[300]} mr="4px">
              {operationType}
            </Text>
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
        <Flex align="center">
          <Contract mr="8px" />
          <TzktLink operation={operation} mr="8px">
            <Heading size="sm">{contractTitle}</Heading>
          </TzktLink>
          <Fee operation={operation} />
        </Flex>
        <Flex alignSelf="flex-end">
          <Timestamp timestamp={operation.timestamp} />
        </Flex>
      </Flex>
      <Box>
        <Flex justifyContent="space-between">
          <Flex>
            <Flex mr="15px">
              <Text mr="6px" color={colors.gray[450]}>
                From:
              </Text>
              {/* TODO: use zod */}
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end" align="center">
            <Text color={colors.gray[300]} mr="4px">
              Contract Origination
            </Text>
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
  const tokenTransfer = getTokenTransfer(operation.id as number); // TODO: use zod

  let element = null;

  switch (operation.type) {
    case "transaction": {
      const isContractCall = !!operation.parameter;
      if (tokenTransfer) {
        element = <TokenTransferTile operation={operation} tokenTransfer={tokenTransfer} />;
      } else if (isContractCall) {
        element = <ContractCallTile operation={operation} />;
      } else {
        element = <TransactionTile operation={operation} />;
      }
      break;
    }
    case "delegation":
      element = <DelegationTile operation={operation} />;
      break;
    case "origination":
      element = <OriginationTile operation={operation} />;
      break;
  }

  return (
    <Flex p="20px" bg={colors.gray[900]}>
      {element}
    </Flex>
  );
};
