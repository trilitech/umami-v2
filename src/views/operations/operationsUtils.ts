import { TezosNetwork } from "@airgap/tezos";
import { formatRelative } from "date-fns";
import { z } from "zod";
import { getTokenPrettyBalance } from "../../types/Asset";
import {
  OperationDisplay,
  TezTransfer,
  TokenTransfer,
} from "../../types/Operation";
import { Token } from "../../types/Token";
import { filterNulls } from "../../utils/helpers";
import { classifyToken } from "../../utils/token/classify/classifyToken";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../../utils/format";

export const classifyTokenTransfer = (transfer: TokenTransfer) => {
  const token: Token = {
    balance: transfer.amount,
    token: transfer.token === null ? undefined : transfer.token, // XD
  };

  return classifyToken(token);
};

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
    level: z.number(),
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
      amount: {
        prettyDisplay: sign + prettyTezAmount(new BigNumber(required.amount)),
      },
      prettyTimestamp,
      timestamp: required.timestamp,
      recipient: required.target.address,
      sender: required.sender.address,
      type: required.type,
      tzktUrl: getHashUrl(required.hash, network),
      fee:
        transfer.bakerFee !== undefined
          ? prettyTezAmount(new BigNumber(transfer.bakerFee))
          : undefined,
      status: "confirmed",
      level: required.level,
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
  // "from" field is missing sometimes
  const TokenTransaction = z.object({
    from: z.object({ address: z.string() }),
    to: z.object({ address: z.string() }),
    timestamp: z.string(),
    amount: z.string(),
    level: z.number(),
  });

  const asset = classifyTokenTransfer(transfer);

  const transferRequired = TokenTransaction.safeParse(transfer);

  if (!asset || !transferRequired.success) {
    return null;
  }

  const required = transferRequired.data;
  const metadata = transfer.token?.metadata;

  const sign = getSign(forAddress, required.from.address, required.to.address);

  const displayUri = metadata && metadata.displayUri;

  const level = required.level;

  const prettyTimestamp = formatRelative(
    new Date(required.timestamp),
    new Date()
  );

  let prettyAmount: string;
  if (asset.type === "nft") {
    prettyAmount = asset.balance;
  } else {
    prettyAmount = getTokenPrettyBalance(asset, { showSymbol: true });
  }

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
    tzktUrl: getLevelUrl(level, network),
    level,
  };
  return result;
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
