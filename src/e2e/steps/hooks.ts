import crypto from "crypto";

import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { ChromiumBrowser, chromium } from "@playwright/test";

import { BASE_URL } from "./onboarding";
import { CustomWorld } from "./world";
import { TEST_NETWORKS_STATE, killNode, resetBlockchain } from "../utils";

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: !!process.env.CI });

  global.crypto = crypto as any;
});

/**
 * This hook runs before each scenario.
 *
 * It populates the localStorage with the provided initial app state + testing network settings,
 * and opens an empty page.
 *
 * `reduxState` is expected to be set up inside the first step definition.
 * Therefore `async` is added to avoid blocking on not having `reduxState` when the hook is run.
 *
 * Please refer to {@link CustomWorld} for information on how to set up tests correctly.
 */
Before(async function (this: CustomWorld) {
  (async () => {
    const state: any = {
      _persist: '{"version":-1,"rehydrated":true}',
      networks: TEST_NETWORKS_STATE,
      ...(await this.getReduxState()),
    };

    // each value should be a valid JSON string for redux-persist
    Object.keys(state).forEach(key => {
      state[key] = JSON.stringify(state[key]);
    });

    this.context = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: BASE_URL,
            localStorage: [
              // TODO: add a way to pass in the accounts (they are stored under persist:accounts)
              { name: "persist:root", value: JSON.stringify(state) },
            ],
          },
        ],
      },
    });
    this.page = await this.context.newPage();
  })();

  resetBlockchain();
});

After(async function (this: CustomWorld) {
  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
  killNode();
});
