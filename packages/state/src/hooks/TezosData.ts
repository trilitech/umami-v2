type ChainMetadata = {
  chainId: string;
  name: string;
  rgb: string;
  rpc: string;
  namespace: string;
};

/**
 * Chains
 */
const TEZOS_MAINNET_CHAINS: Record<string, ChainMetadata> = {
  "tezos:mainnet": {
    chainId: "mainnet",
    name: "Tezos",
    rgb: "44, 125, 247",
    rpc: "https://rpc.tzbeta.net",
    namespace: "tezos",
  },
};

const TEZOS_TEST_CHAINS: Record<string, ChainMetadata> = {
  "tezos:testnet": {
    chainId: "testnet",
    name: "Tezos Testnet",
    rgb: "44, 125, 247",
    rpc: "https://rpc.ghostnet.teztnets.com",
    namespace: "tezos",
  },
};

export const TEZOS_CHAINS = { ...TEZOS_MAINNET_CHAINS, ...TEZOS_TEST_CHAINS };

/**
 * Methods
 */
export const TEZOS_SIGNING_METHODS = {
  TEZOS_GET_ACCOUNTS: "tezos_getAccounts",
  TEZOS_SEND: "tezos_send",
  TEZOS_SIGN: "tezos_sign",
};

export function getChainData(chainId?: string) {
  if (!chainId) {return;}
  const [namespace, reference] = chainId.toString().split(":");
  return Object.values(TEZOS_CHAINS).find(
    chain => chain.chainId == reference && chain.namespace === namespace
  );
}
