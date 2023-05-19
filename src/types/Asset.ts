import { BigNumber } from "bignumber.js";
import type { Token, TokenMetadata } from "./Token";
import { z } from "zod";
import { getIPFSurl } from "../utils/token/nftUtils";

const addressParser = z.object({ address: z.string() });

const fa1TokenParser = z.object({
  standard: z.string().regex(/fa1\.2/i),
  contract: addressParser,
});

const fa1parser = z.object({
  balance: z.string(),
  token: fa1TokenParser,
});

const fa2TokenParser = z.object({
  standard: z.string().regex(/fa2/i),
  tokenId: z.string(),
  contract: addressParser,
});

const fa2parser = z.object({
  balance: z.string(),
  token: fa2TokenParser,
});

const nftTokenParser = z.object({
  standard: z.string().regex(/fa2/i),
  tokenId: z.string(),
  contract: addressParser,
  metadata: z.object({
    displayUri: z.string(),
  }),
});

const nftParser = z.object({
  balance: z.string(),
  account: addressParser,
  token: nftTokenParser,
});

export abstract class Asset {
  constructor(
    public contract: string,
    public balance: string,
    public metadata?: TokenMetadata
  ) {}

  static from(raw: Token): Asset | null {
    const metadata = raw.token?.metadata;

    const fa1result = fa1parser.safeParse(raw);
    if (fa1result.success) {
      return new FA12Token(
        fa1result.data.token.contract.address,
        fa1result.data.balance,
        metadata
      );
    }

    if (!metadata) {
      console.log("Impossible state, FA2 metadata is empty");
      return null;
    }

    const nftResult = nftParser.safeParse(raw);
    if (nftResult.success) {
      return new NFT(
        nftResult.data.token.contract.address,
        nftResult.data.balance,
        nftResult.data.token.tokenId,
        nftResult.data.account.address,
        metadata
      );
    }

    const fa2result = fa2parser.safeParse(raw);
    if (fa2result.success) {
      return new FA2Token(
        fa2result.data.token.contract.address,
        fa2result.data.balance,
        fa2result.data.token.tokenId,
        metadata
      );
    }

    return null;
  }

  protected abstract defaultTokenName(): string;
  protected abstract defaultTokenSymbol(): string;

  name(): string {
    return this.metadata?.name || this.defaultTokenName();
  }

  symbol(): string {
    return this.metadata?.symbol || this.defaultTokenSymbol();
  }

  abstract iconUri(): string | undefined;

  prettyBalance(options?: { showSymbol?: boolean }) {
    const symbol = this.symbol();
    const amount = this.balance;
    const decimals = this.metadata?.decimals;
    const trailingSymbol = options?.showSymbol ? ` ${symbol}` : "";
    const result = formatTokenAmount(amount, decimals);

    return `${result}${trailingSymbol}`;
  }

  getRealAmount(prettyAmount: string): BigNumber {
    const amount = new BigNumber(prettyAmount);

    const decimals =
      this.metadata?.decimals === undefined
        ? DEFAULT_TOKEN_DECIMALS
        : this.metadata.decimals;

    return amount.multipliedBy(new BigNumber(10).exponentiatedBy(decimals));
  }
}

export class FA12Token extends Asset {
  defaultTokenName(): string {
    return DEFAULT_FA1_NAME;
  }

  defaultTokenSymbol(): string {
    return DEFAULT_FA1_SYMBOL;
  }

  iconUri(): string | undefined {
    return this.metadata?.icon && getIPFSurl(this.metadata.icon);
  }
}

export class FA2Token extends Asset {
  constructor(
    public contract: string,
    public balance: string,
    public tokenId: string,
    public metadata: TokenMetadata
  ) {
    super(contract, balance, metadata);
  }

  defaultTokenName(): string {
    return DEFAULT_FA2_NAME;
  }

  defaultTokenSymbol(): string {
    return DEFAULT_FA2_SYMBOL;
  }

  iconUri(): string | undefined {
    return (
      this.metadata?.thumbnailUri && getIPFSurl(this.metadata.thumbnailUri)
    );
  }
}

export class NFT extends Asset {
  constructor(
    public contract: string,
    public balance: string,
    public tokenId: string,
    public owner: string,
    public metadata: TokenMetadata
  ) {
    super(contract, balance, metadata);
  }

  defaultTokenName(): string {
    throw new Error("NotImplementedError");
  }

  defaultTokenSymbol(): string {
    throw new Error("NotImplementedError");
  }

  iconUri(): string | undefined {
    return undefined;
  }

  override getRealAmount(prettyAmount: string): BigNumber {
    return new BigNumber(prettyAmount);
  }
}

export const keepNFTs = (assets: Asset[]) => {
  return assets.filter((a) => a instanceof NFT) as NFT[];
};
export const keepFA1s = (assets: Asset[]) => {
  return assets.filter((a) => a instanceof FA12Token) as FA12Token[];
};

export const keepFA2s = (assets: Asset[]) => {
  return assets.filter((a) => a instanceof FA2Token) as FA2Token[];
};

export const formatTokenAmount = (
  amountStr: string,
  decimals = DEFAULT_TOKEN_DECIMALS
) => {
  return Number(amountStr) / Math.pow(10, Number(decimals));
};

// We use the defaults for FA1.2 tokens as in V1
export const DEFAULT_FA1_NAME = "FA1.2 token";
export const DEFAULT_FA2_NAME = "FA2 token";
export const DEFAULT_FA1_SYMBOL = "FA1.2";
export const DEFAULT_FA2_SYMBOL = "FA2";
export const DEFAULT_TOKEN_DECIMALS = "4";
