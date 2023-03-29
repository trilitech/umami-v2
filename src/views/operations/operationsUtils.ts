import { TezosNetwork } from "@airgap/tezos";
import { formatRelative } from "date-fns";
import { z } from "zod";
import {
  OperationDisplay,
  TezTransfer,
  TokenTransfer,
} from "../../types/Operation";
import { filterNulls } from "../../utils/helpers";
import { prettyTezAmount } from "../../utils/store/impureFormat";
import { getIPFSurl } from "../../utils/token/nftUtils";

// We use the defaults of FA1.2 tokens
const DEFAULT_SYMBOL = "KLD";
const DEFAULT_TOKEN_DECIMALS = 4;

export const getHashUrl = (hash: string, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${hash}`;
};

export const getLevelUrl = (blockLevel: number, network: TezosNetwork) => {
  return `https://${network}.tzkt.io/${blockLevel}/operations`;
};

export const getIsInbound = (prettyAmount: string) => prettyAmount[0] === "+";

const getSign = (address: string, sender: string, recipient: string) => {
  if (address === sender) {
    return "-";
  }

  if (address === recipient) {
    return "+";
  }

  return null;
};

export const getKey = (op: OperationDisplay) => {
  return op.amount.prettyDisplay + op.sender + op.recipient + op.timestamp;
};

export const getTezOperationDisplay = (
  transfer: TezTransfer,
  forAddress: string,
  network = TezosNetwork.MAINNET
) => {
  const TezTransaction = z.object({
    type: z.string().regex(/transaction/i),
    sender: z.object({ address: z.string() }),
    target: z.object({ address: z.string() }),
    timestamp: z.string(),
    amount: z.number(),
    hash: z.string(),
  });

  try {
    const required = TezTransaction.parse(transfer);
    const sender = required.sender.address;
    const target = required.target.address;

    const sign = getSign(forAddress, sender, target);

    const prettyTimestamp = formatRelative(
      new Date(required.timestamp),
      new Date()
    );

    const result: OperationDisplay = {
      amount: { prettyDisplay: sign + prettyTezAmount(required.amount) },
      prettyTimestamp,
      timestamp: required.timestamp,
      recipient: required.target.address,
      sender: required.sender.address,
      type: required.type,
      tzktUrl: getHashUrl(required.hash, network),
      fee:
        transfer.bakerFee !== undefined
          ? prettyTezAmount(transfer.bakerFee)
          : undefined,
      status: "confirmed",
    };
    return result;
  } catch (error) {
    return null;
  }
};

export const getTokenOperationDisplay = (
  transfer: TokenTransfer,
  forAddress: string,
  network = TezosNetwork.MAINNET
) => {
  const TezTransaction = z.object({
    from: z.object({ address: z.string() }),
    to: z.object({ address: z.string() }),
    timestamp: z.string(),
    amount: z.string(),
  });

  try {
    const required = TezTransaction.parse(transfer);
    const metadata = transfer.token?.metadata;

    const sign = getSign(
      forAddress,
      required.from.address,
      required.to.address
    );

    const displayUri = metadata && metadata.displayUri;

    const symbol = (metadata && metadata.symbol) || DEFAULT_SYMBOL;

    const level = transfer.level;
    const decimalsStr = metadata?.decimals;
    const amount = Number(required.amount);
    const decimals =
      decimalsStr == null ? DEFAULT_TOKEN_DECIMALS : Number(decimalsStr);

    const prettyAmount = `${amount / Math.pow(10, decimals)} ${symbol}`;

    const prettyTimestamp = formatRelative(
      new Date(required.timestamp),
      new Date()
    );

    const result: OperationDisplay = {
      type: "transaction",
      amount: {
        prettyDisplay: sign + prettyAmount,
        url: displayUri && getIPFSurl(displayUri),
      },
      prettyTimestamp,
      timestamp: required.timestamp,
      recipient: required.to.address,
      sender: required.from.address,
      tzktUrl: level != null ? getLevelUrl(level, network) : undefined,
    };
    return result;
  } catch (error) {
    // Sometimes "from" field is missing and this throws.
    // Is this a bug from tzkt ?
    return null;
  }
};

export const sortOperationsDisplaysBytDate = (ops: OperationDisplay[]) => {
  return [...ops].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

export const getOperationDisplays = (
  tezTransfers: TezTransfer[] = [],
  tokenTransfers: TokenTransfer[] = [],
  forAdress: string,
  network: TezosNetwork = TezosNetwork.MAINNET
) => {
  return sortOperationsDisplaysBytDate(
    filterNulls([
      ...tezTransfers.map((t) => getTezOperationDisplay(t, forAdress, network)),
      ...tokenTransfers.map((t) =>
        getTokenOperationDisplay(t, forAdress, network)
      ),
    ])
  );
};
