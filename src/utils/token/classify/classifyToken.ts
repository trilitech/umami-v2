import { z } from "zod";
import { Asset, FA12Token, FA2Token, NFT } from "../../../types/Asset";
import { Token } from "../../../types/Token";

/**
 * Runtime validations with zod
 */
const contract = z.object({ address: z.string() });
const balance = z.string();
const id = z.number();

const getFA1Required = (input: Token) => {
  const FA1 = z.object({
    balance,
    token: z.object({
      standard: z.string().regex(/fa1\.2/i),
      contract,
    }),
  });

  try {
    const result = FA1.parse(input);
    return { contract: result.token.contract.address, balance: result.balance };
  } catch (error) {
    return null;
  }
};

const getFA2TokenRequired = (input: Token) => {
  const FA1 = z.object({
    balance,
    token: z.object({
      standard: z.string().regex(/fa2/i),
      contract,
      id,
    }),
  });

  try {
    const result = FA1.parse(input);
    return {
      contract: result.token.contract.address,
      balance: result.balance,
      id: result.token.id,
    };
  } catch (error) {
    return null;
  }
};

const getNFTRequired = (input: Token) => {
  const NFT = z.object({
    balance,
    token: z.object({
      standard: z.string().regex(/fa2/i),
      contract,
      id,
      metadata: z.object({
        displayUri: z.string(),
      }),
    }),
  });

  try {
    const result = NFT.parse(input);

    return {
      contract: result.token.contract.address,
      balance: result.balance,
      id: result.token.id,
      displayUri: result.token.metadata.displayUri,
    };
  } catch (error) {
    return null;
  }
};

/**
 *  Build our token representations with runtime validation for mandatory fields
 *  These factory functions return null if runtime validatin doesn't pass
 */
const makeFa1 = (json: Token): FA12Token | null => getFA1Required(json);

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
      displayUri,
      name: metadata?.name,
      symbol: metadata?.symbol,
    },
  };
};

export const classifyToken = (json: Token): Asset | null =>
  makeFa1(json) || makeNft(json) || makeFa2(json);
