import { z } from "zod";
import { Asset, FA12Token, FA2Token, NFT } from "../../../types/Asset";
import { Token } from "../../../types/Token";
import { getIPFSurl } from "../nftUtils";

/**
 * Runtime validations with zod
 */
const address = z.object({ address: z.string() });
const balance = z.string();
const tokenId = z.string();

const fa1Token = z.object({
  standard: z.string().regex(/fa1\.2/i),
  contract: address,
});

const fa2Token = z.object({
  standard: z.string().regex(/fa2/i),
  tokenId,
  contract: address,
});

const nftToken = z.object({
  standard: z.string().regex(/fa2/i),
  tokenId,
  contract: address,
  metadata: z.object({
    displayUri: z.string(),
  }),
});

const getFA1Required = (input: Token) => {
  const FA1 = z.object({
    balance,
    token: fa1Token,
  });

  const result = FA1.safeParse(input);

  if (!result.success) {
    return null;
  }

  const { data } = result;
  return { contract: data.token.contract.address, balance: data.balance };
};

const getFA2TokenRequired = (input: Token) => {
  const FA2 = z.object({
    balance,
    token: fa2Token,
  });

  const result = FA2.safeParse(input);

  if (!result.success) {
    return null;
  }

  const { data } = result;
  return {
    contract: data.token.contract.address,
    balance: data.balance,
    tokenId: data.token.tokenId,
  };
};

const getNFTRequired = (input: Token) => {
  const NFT = z.object({
    balance,
    account: address,
    token: nftToken,
  });

  const result = NFT.safeParse(input);
  if (!result.success) {
    return null;
  }

  const { data } = result;

  return {
    contract: data.token.contract.address,
    balance: data.balance,
    tokenId: data.token.tokenId,
    displayUri: data.token.metadata.displayUri,
    owner: data.account.address,
  };
};

/**
 *  Build our token representations with runtime validation for mandatory fields
 *  These factory functions return null if runtime validatin doesn't pass
 */
const makeFa1 = (json: Token): FA12Token | null => {
  const data = getFA1Required(json);
  return data && { ...data, type: "fa1.2" };
};

const makeFa2 = (json: Token): FA2Token | null => {
  const required = getFA2TokenRequired(json);
  const metadata = json.token?.metadata;
  return (
    required && {
      ...required,
      metadata: {
        decimals: metadata?.decimals,
        name: metadata?.name,
        symbol: metadata?.symbol,
      },
      type: "fa2",
    }
  );
};

export const makeNft = (json: Token): NFT | null => {
  const required = getNFTRequired(json);

  if (!required) {
    return null;
  }

  const { displayUri, ...rest } = required;
  const metadata = json.token?.metadata;

  return {
    ...rest,
    metadata: {
      displayUri: getIPFSurl(displayUri),
      name: metadata?.name,
      symbol: metadata?.symbol,
    },
    type: "nft",
  };
};

export const classifyToken = (json: Token): Asset | null =>
  makeFa1(json) || makeNft(json) || makeFa2(json);
