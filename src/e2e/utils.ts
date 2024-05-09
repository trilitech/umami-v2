import { StdioOptions, execSync } from "child_process";

import { Page } from "@playwright/test";
import { noop } from "lodash";

import { RawPkh } from "../types/Address";
import { DefaultNetworks } from "../types/Network";
import { getAccounts } from "../utils/tezos";

const TEST_NETWORK = {
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

export const runDockerCommand = (command: string, stdio: StdioOptions = "ignore") =>
  execSync(`docker compose ${command}`, {
    stdio,
    env: {
      COMPOSE_PROJECT_NAME: process.env.CUCUMBER_WORKER_ID,
      ...process.env,
    },
  });

const startNode = () => runDockerCommand("up --wait --wait-timeout 60");

export const killNode = () => {
  runDockerCommand("kill");
  runDockerCommand("down");
};

// this should be called before each test that uses the blockchain/indexer
// we need to make sure that each test has a clean state
// such tests should be run sequentially to avoid conflicts/race conditions/etc.
// this thing takes ~15 secs to run so it should be used only when necessary
// if the test doesn't involve any blockchain/indexer interaction then do not call this function
export const resetBlockchain = () => {
  killNode();
  startNode();
};

export const topUpAccount = async (account: RawPkh, tez: string) => {
  let accountInfo = await getAccounts([account], TEST_NETWORK);
  const prevBalance = accountInfo[0]?.balance;

  // alice is a bootstrapped account on tezbox with lots of Tez
  runDockerCommand(
    `exec -T tezos_node octez-client --wait none transfer ${tez} from alice to ${account} --burn-cap 1`
  );

  // wait until the balance has updated
  let currBalance = prevBalance;
  while (prevBalance === currBalance) {
    accountInfo = await getAccounts([account], TEST_NETWORK);
    currBalance = accountInfo[0]?.balance;
  }
};

export const waitUntilRefetch = (page: Page) =>
  runAndWaitUntilRefetch(page, () => Promise.resolve());

export const refetch = (page: Page) =>
  runAndWaitUntilRefetch(page, () => page.getByTestId("refetch-button").click());

const runAndWaitUntilRefetch = async (page: Page, action: () => Promise<void>) => {
  const getLastTimeUpdated = () => (window as any).reduxStore.getState().assets.lastTimeUpdated;

  const prevTimeUpdated = await page.evaluate(getLastTimeUpdated);

  await action();

  // wait until the lastTimeUpdated has changed
  return new Promise(resolve => {
    const interval = setInterval(() => {
      page
        .evaluate(getLastTimeUpdated)
        .then(currTimeUpdated => {
          if (currTimeUpdated !== prevTimeUpdated) {
            clearInterval(interval);
            resolve(undefined);
          }
        })
        .catch(noop);
    }, 100);
  });
};
