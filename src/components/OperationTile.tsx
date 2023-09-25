import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import colors from "../style/colors";
import { useGetTokenTransfer, useIsBlockFinalised } from "../utils/hooks/assetsHooks";
import { OperationDisplay } from "../types/Transfer";
import { getIsInbound } from "../views/operations/operationsUtils";
import AddressPill from "./AddressPill/AddressPill";
import { TzktCombinedOperation, TransactionOperation } from "../utils/tezos";
import { RawPkh, parsePkh } from "../types/Address";
import { useAllAccounts } from "../utils/hooks/accountHooks";
import { formatRelative } from "date-fns";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../utils/format";
import { useGetToken } from "../utils/hooks/tokensHooks";

const TokenTransferTile: React.FC<{
  operation: TransactionOperation;
  tokenId: string;
  contract: RawPkh;
}> = ({ operation, tokenId, contract }) => {
  const getToken = useGetToken();
  const isIncoming = useIsIncomingOperation(operation);

  const token = getToken(contract, tokenId);
  const isNFT = token?.type === "nft";

  const amount = isNFT ? operation.amount : ;

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Flex>
          <Flex mr="8px">
            {isIncoming ? (
              <Text fontWeight="600" color={colors.orange}>
                - {prettyTezAmount(String(operation.amount))}
              </Text>
            ) : (
              <Text fontWeight="600" color={colors.green}>
                + {prettyTezAmount(String(operation.amount))}
              </Text>
            )}
          </Flex>
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
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>

            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
              <AddressPill address={parsePkh(operation.target?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end">
            <Text color={colors.gray[300]}>Transaction</Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const Fee: React.FC<{ operation: TzktCombinedOperation }> = ({ operation }) => {
  let fee = BigNumber(operation.bakerFee || 0);
  if ("storageFee" in operation) {
    fee = fee.plus(operation.storageFee || 0);
  }

  if (fee.gt(0)) {
    return null;
  }

  return (
    <Flex>
      <Heading color={colors.gray[450]} mr="4px">
        Fee:
      </Heading>
      <Text color={colors.gray[400]}>{prettyTezAmount(fee)}</Text>
    </Flex>
  );
};

const useIsIncomingOperation = (operation: TransactionOperation) => {
  const ownedAccounts = useAllAccounts();
  // TODO: check how that works!
  return !ownedAccounts.map(acc => acc.address.pkh).includes(operation.target?.address as string);
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

  return (
    <Flex direction="column" w="100%">
      <Flex justifyContent="space-between" mb="10px">
        <Flex>
          <Flex mr="8px">
            {isIncoming ? (
              <Text fontWeight="600" color={colors.orange}>
                - {prettyTezAmount(String(operation.amount))}
              </Text>
            ) : (
              <Text fontWeight="600" color={colors.green}>
                + {prettyTezAmount(String(operation.amount))}
              </Text>
            )}
          </Flex>
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
              <AddressPill address={parsePkh(operation.sender?.address as string)} />
            </Flex>

            <Flex>
              <Text mr="6px" color={colors.gray[450]}>
                To:
              </Text>
              <AddressPill address={parsePkh(operation.target?.address as string)} />
            </Flex>
          </Flex>
          <Flex alignSelf="flex-end">
            <Text color={colors.gray[300]}>Transaction</Text>
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
  const tokenTransfer = getTokenTransfer(operation.id as number);

  return (
    <Flex p="20px">
      {operation.type === "transaction" && tokenTransfer && (
        <TokenTransferTile
          operation={operation}
          tokenId={tokenTransfer.token.tokenId as string}
          contract={tokenTransfer.token.contract.address as string}
        />
      )}
      {operation.type === "transaction" && !tokenTransfer && (
        <TransactionTile operation={operation} />
      )}

      {/* TODO: define */}
      {operation.type === "delegation" && <Box>Delegation</Box>}
      {/* TODO: define */}
      {operation.type === "origination" && <Box>Origination</Box>}
    </Flex>
  );
};
