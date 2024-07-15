import { DefaultNetworks } from "@umami/tezos";

export const TEST_NETWORK = {
  name: "Test net",
  rpcUrl: "http://0.0.0.0:2000" + (process.env.CUCUMBER_WORKER_ID || "0"),
  tzktApiUrl: "http://0.0.0.0:500" + (process.env.CUCUMBER_WORKER_ID || "0"),
  tzktExplorerUrl: "http://unavailable",
  buyTezUrl: "",
};

export const TEST_NETWORKS_STATE = {
  available: [...DefaultNetworks, TEST_NETWORK],
  current: TEST_NETWORK,
};

export const DEFAULT_ACCOUNTS: Record<string, { pk: string; pkh: string; sk: string }> = {
  alice: {
    pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
    pk: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
    sk: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
  },
  bob: {
    pkh: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
    pk: "edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4",
    sk: "edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt",
  },
  baker1: {
    pkh: "tz1faswCTDciRzE4oJ9jn2Vm2dvjeyA9fUzU",
    pk: "edpkuTXkJDGcFd5nh6VvMz8phXxU3Bi7h6hqgywNFi1vZTfQNnS1RV",
    sk: "edsk4ArLQgBTLWG5FJmnGnT689VKoqhXwmDPBuGx3z4cvwU9MmrPZZ",
  },
  baker2: {
    pkh: "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN",
    pk: "edpktzNbDAUjUk697W7gYg2CRuBQjyPxbEg8dLccYYwKSKvkPvjtV9",
    sk: "edsk39qAm1fiMjgmPkw1EgQYkMzkJezLNewd7PLNHTkr6w9XA2zdfo",
  },
  baker3: {
    pkh: "tz1b7tUupMgCNw2cCLpKTkSD1NZzB5TkP2sv",
    pk: "edpkuFrRoDSEbJYgxRtLx2ps82UdaYc1WwfS9sE11yhauZt5DgCHbU",
    sk: "edsk2uqQB9AY4FvioK2YMdfmyMrer5R8mGFyuaLLFfSRo8EoyNdht3",
  },
};
