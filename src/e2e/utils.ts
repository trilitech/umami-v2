import { Page, expect, test } from "@playwright/test";
import { RawPkh } from "../types/Address";
import { exec } from "child_process";

export const cleanupState = () => {
  test.beforeEach(async ({ page }) => {
    page.addInitScript(() => {
      window.localStorage.clear();

      window.localStorage.setItem(
        "persist:root",
        JSON.stringify({
          // sets the test network as selected
          networks:
            '{"available":[{"name":"mainnet","rpcUrl":"https://prod.tcinfra.net/rpc/mainnet/","tzktApiUrl":"https://api.mainnet.tzkt.io","tzktExplorerUrl":"https://tzkt.io","buyTezUrl":"https://widget.wert.io"},{"name":"ghostnet","rpcUrl":"https://ghostnet.ecadinfra.com","tzktApiUrl":"https://api.ghostnet.tzkt.io","tzktExplorerUrl":"https://ghostnet.tzkt.io","buyTezUrl":"https://faucet.ghostnet.teztnets.xyz/"},{"name":"Test net","rpcUrl":"http://0.0.0.0:20000","tzktApiUrl":"http://0.0.0.0:5000","tzktExplorerUrl":"http://unavailable","buyTezUrl":""}],"current":{"name":"Test net","rpcUrl":"http://0.0.0.0:20000","tzktApiUrl":"http://0.0.0.0:5000","tzktExplorerUrl":"http://unavailable","buyTezUrl":""}}',
          _persist: '{"version":-1,"rehydrated":true}',
        })
      );
    });
  });
};

export const startNode = () =>
  new Promise((resolve, reject) => {
    exec("docker-compose up --wait", error => {
      if (error) {
        return reject(error);
      }
      resolve(undefined);
    });
  });

export const killNode = () =>
  new Promise((resolve, reject) => {
    exec("docker-compose kill && docker-compose down", error => {
      if (error) {
        return reject(error);
      }
      resolve(undefined);
    });
  });

// this should be called before each test that uses the blockchain/indexer
// we need to make sure that each test has a clean state
// such tests should be run sequentially to avoid conflicts/race conditions/etc.
// this thing takes ~15 secs to run so it should be used only when necessary
// if the test doesn't involve any blockchain/indexer interaction then do not call this function
export const resetBlockchain = () => killNode().then(startNode);

export const topUpAccount = async (account: RawPkh, tez: string) => {
  return new Promise((resolve, reject) => {
    exec(
      `docker-compose exec -T flextesa octez-client --wait none transfer ${tez} from alice to ${account} --burn-cap 1`,
      error => {
        if (error) {
          return reject(error);
        }
        resolve(undefined);
      }
    );
  });
};

export const refetch = async (page: Page) => {
  await page.getByTestId("refetch-button").click();
  // give time to fetch & refresh everything
  await page.waitForTimeout(500);
};
