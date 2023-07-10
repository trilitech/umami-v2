import { TezosNetwork } from "@airgap/tezos";
import { formatRelative } from "date-fns";
import { z } from "zod";
import { tokenPrettyBalance } from "../../types/TokenBalance";
import { OperationDisplay, TezTransfer, TokenTransfer } from "../../types/Operation";
import { fromRaw } from "../../types/TokenBalance";
import { compact } from "lodash";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../../utils/format";
import { DelegationOperation } from "@tzkt/sdk-api";
import { parsePkh } from "../../types/Address";

export const getHashUrl = (hash: string, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${hash}`;
};

export const getTransactionUrl = ({
  transactionId,
  originationId,
  migrationId,
  network,
}: {
  transactionId: number | undefined;
  originationId: number | undefined;
  migrationId: number | undefined;
  network: TezosNetwork;
}) => {
  if (transactionId) {
    return `https://${network}.tzkt.io/transactions/${transactionId}`;
  }
  if (originationId) {
    return `https://${network}.tzkt.io/originations/${originationId}`;
  }
  if (migrationId) {
    return `https://${network}.tzkt.io/migrations/${migrationId}`;
  }
  throw new Error("Cannot find transaction TzKT URL");
};

export const getIsInbound = (prettyAmount: string) => prettyAmount[0] === "+";

export const getAmountColor = (prettyAmount: string) => {
  const sign = prettyAmount[0];
  if (sign === "+") {
    return "umami.green";
  } else if (sign === "-") {
    return "umami.orange";
  }
  return "umami.gray.400";
};

const getSign = (address: string, sender: string, recipient: string) => {
  if (address === sender) {
    return "-";
  }

  if (address === recipient) {
    return "+";
  }

  throw new Error(`Address ${address} doesn't match sender or recipient`);
};

export const getKey = (op: OperationDisplay) => {
  // id is unique, but it might be that we have
  // both the recipient and the sender accounts
  // and in that case the only way to differentiate
  // would be to use the operation sign (+/-)
  return op.amount.prettyDisplay + op.id;
};

const Address = { address: z.string() };

const TezTransaction = z.object({
  id: z.number(),
  type: z.string(),
  sender: z.object(Address),
  target: z.object(Address),
  timestamp: z.string(),
  amount: z.number(),
  hash: z.string(),
  level: z.number(),
});

export const getTezOperationDisplay = (
  transfer: TezTransfer,
  forAddress: string,
  network = TezosNetwork.MAINNET
) => {
  const parseResult = TezTransaction.safeParse(transfer);
  if (!parseResult.success) {
    console.warn("getTezOperationDisplay failed parsing");
    return null;
  }
  const parsed = parseResult.data;
  const sender = parsed.sender.address;
  const target = parsed.target.address;

  const sign = getSign(forAddress, sender, target);

  const prettyTimestamp = formatRelative(new Date(parsed.timestamp), new Date());

  const result: OperationDisplay = {
    id: parsed.id,
    amount: {
      prettyDisplay: sign + prettyTezAmount(new BigNumber(parsed.amount)),
    },
    prettyTimestamp,
    timestamp: parsed.timestamp,
    recipient: parsePkh(parsed.target.address),
    sender: parsePkh(parsed.sender.address),
    type: "transaction",
    tzktUrl: getHashUrl(parsed.hash, network),
    fee:
      transfer.bakerFee !== undefined
        ? prettyTezAmount(new BigNumber(transfer.bakerFee))
        : undefined,
    status: "confirmed",
    level: parsed.level,
  };
  return result;
};

const TokenTransaction = z.object({
  id: z.number(),
  // When the "from" field is missing, we assume that the token is minted by the contract.
  from: z.object(Address).optional(),
  to: z.object(Address),
  token: z.object({
    contract: z.object(Address),
  }),
  timestamp: z.string(),
  amount: z.string(),
  level: z.number(),
  transactionId: z.number().optional(),
  migrationId: z.number().optional(),
  originationId: z.number().optional(),
});

export const getTokenOperationDisplay = (
  transfer: TokenTransfer,
  forAddress: string,
  network = TezosNetwork.MAINNET
) => {
  const asset = fromRaw({ balance: transfer.amount, token: transfer.token });

  const transferRequired = TokenTransaction.safeParse(transfer);

  if (!asset || !transferRequired.success) {
    console.warn("getTokenOperationDisplay failed parsing");
    return null;
  }

  const parsed = transferRequired.data;

  const sender = parsed.from?.address || parsed.token.contract.address;

  const metadata = transfer.token.metadata;

  const sign = getSign(forAddress, sender, parsed.to.address);

  const uri = metadata && (metadata.thumbnailUri || metadata.displayUri);
  const displayId = transfer.token.id;

  const level = parsed.level;

  const prettyTimestamp = formatRelative(new Date(parsed.timestamp), new Date());

  let prettyAmount: string;
  if (asset.type === "nft") {
    prettyAmount = asset.balance;
  } else {
    prettyAmount = tokenPrettyBalance(asset, { showSymbol: true });
  }

  const result: OperationDisplay = {
    id: parsed.id,
    type: "transaction",
    amount: {
      prettyDisplay: sign + prettyAmount,
      url: uri && getIPFSurl(uri),
      id: displayId,
    },
    prettyTimestamp,
    timestamp: parsed.timestamp,
    recipient: parsePkh(parsed.to.address),
    sender: parsePkh(sender),
    tzktUrl: getTransactionUrl({
      transactionId: parsed.transactionId,
      originationId: parsed.originationId,
      migrationId: parsed.migrationId,
      network,
    }),
    level,
  };
  return result;
};

const DelegationSchema = z.object({
  id: z.number(),
  sender: z.object(Address),
  newDelegate: z.object(Address).optional(),
  timestamp: z.string(),
  amount: z.number(),
  hash: z.string(),
  level: z.number(),
  bakerFee: z.number(),
});

const getDelegationOperationDisplay = (
  delegation: DelegationOperation,
  network = TezosNetwork.MAINNET
): OperationDisplay | null => {
  const parseResult = DelegationSchema.safeParse(delegation);

  if (!parseResult.success) {
    console.warn("getDelegationOperationDisplay failed parsing", parseResult.error);

    return null;
  }

  const parsed = parseResult.data;

  if (!parsed.newDelegate) {
    return null;
  }

  const prettyAmount = prettyTezAmount(new BigNumber(parsed.amount));

  const prettyTimestamp = formatRelative(new Date(parsed.timestamp), new Date());
  const level = parsed.level;

  return {
    id: parsed.id,
    type: "delegation",
    amount: {
      prettyDisplay: prettyAmount,
    },
    prettyTimestamp,
    timestamp: parsed.timestamp,
    recipient: parsePkh(parsed.newDelegate.address),
    sender: parsePkh(parsed.sender.address),
    tzktUrl: getHashUrl(parsed.hash, network),
    level,
    fee: prettyTezAmount(new BigNumber(parsed.bakerFee)),
  };
};

export const sortOperationsByTimestamp = (ops: OperationDisplay[]) => {
  return [...ops].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const getOperationDisplays = (
  tezTransfers: TezTransfer[] = [],
  tokenTransfers: TokenTransfer[] = [],
  delegation: DelegationOperation | null = null,
  forAdress: string,
  network: TezosNetwork = TezosNetwork.MAINNET
) => {
  return sortOperationsByTimestamp(
    compact([
      ...tezTransfers.map(t => getTezOperationDisplay(t, forAdress, network)),
      ...tokenTransfers.map(t => getTokenOperationDisplay(t, forAdress, network)),
      delegation ? getDelegationOperationDisplay(delegation) : null,
    ])
  );
};
