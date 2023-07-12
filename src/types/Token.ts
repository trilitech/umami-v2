import * as tzktApi from "@tzkt/sdk-api";

// TzKT defines metadada as any, but we need to have at least some clarity of what can be inside
export type Metadata = {
  name?: string;
  symbol?: string;
  decimals?: string;
  description?: string;
  artifactUri?: string;
  displayUri?: string;
  thumbnailUri?: string;
  icon?: string;
  externalUri?: string;
  isBooleanAmount?: boolean;
  shouldPreferSymbol?: boolean;
  isTransferable?: boolean;
  creators?: string[];
  tags?: string[];
  rights?: string;
  royalties?: {
    shares: {
      [prop: string]: string;
    };
    decimals: string;
  };
  attributes?: Array<{
    name: string;
    value: string;
  }>;
  date?: string;
  type?: string;
  rarity?: string;
  language?: string;
  formats?: Array<{
    uri?: string;
    fileName?: string;
    fileSize?: string;
    mimeType?: string;
  }>;
};

export type RawTokenInfo = Omit<tzktApi.TokenInfo, "metadata"> & {
  metadata?: Metadata;
};

export type RawToken = Omit<tzktApi.TokenBalance, "token"> & { token: RawTokenInfo };
