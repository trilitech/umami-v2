import crypto from "crypto";

import { After, AfterAll, Before, BeforeAll, setDefaultTimeout } from "@cucumber/cucumber";
import { type ChromiumBrowser, chromium } from "@playwright/test";
import { makeStore, VERSION as stateVersion } from "@umami/state";
import { secondsToMilliseconds } from "date-fns";
import { omit } from "lodash";

import { BASE_URL } from "./onboarding";
import { type CustomWorld } from "./world";
import { TEST_NETWORKS_STATE } from "../constants";
import { killNode, resetBlockchain } from "../utils";

setDefaultTimeout(secondsToMilliseconds(15));

let browser: ChromiumBrowser;

const resourceCleanup = () => {
  void browser.close();
  killNode();
};

BeforeAll({ timeout: secondsToMilliseconds(20) }, async function () {
  browser = await chromium.launch({ headless: !process.env.OPEN_BROWSER });
  process.on("SIGINT", resourceCleanup);

  Object.defineProperty(global, "crypto", crypto);
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
  const blockchainPromise = new Promise<void>(resolve => {
    resetBlockchain();
    resolve();
  });

  void (async () => {
    const predefinedState = await this.getReduxState();
    const initialState = makeStore().getState();
    const accounts = { ...initialState.accounts, ...predefinedState["accounts"] };
    const state: any = {
      ...omit(initialState, ["accounts", "_persist"]),
      networks: TEST_NETWORKS_STATE,
      ...omit(predefinedState, "accounts"),
    };

    const prepareObjForRedux = (obj: any): void => {
      // without this redux considers the object to be malformed
      // and overrides it with the default state
      obj["_persist"] = { version: stateVersion, rehydrated: true };

      // each value should be a valid JSON string
      Object.keys(obj).forEach(key => {
        obj[key] = JSON.stringify(obj[key]);
      });
    };

    prepareObjForRedux(state);
    prepareObjForRedux(accounts);

    this.context = await browser.newContext({
      // default window size as per electron.js settings
      viewport: {
        width: 1440,
        height: 1024,
      },
      storageState: {
        cookies: [],
        origins: [
          {
            origin: BASE_URL,
            localStorage: [
              { name: "persist:root", value: JSON.stringify(state) },
              { name: "persist:accounts", value: JSON.stringify(accounts) },
            ],
          },
        ],
      },
    });
    this.page = await this.context.newPage();
    if (process.env.PRINT_BROWSER_LOGS) {
      this.page.on("console", msg => console.log("PAGE LOG:", msg.text()));
    }
    this.page.setDefaultTimeout(secondsToMilliseconds(10));
  })();

  await blockchainPromise;
});

After(async function (this: CustomWorld) {
  // helps with debugging failing tests
  // the screenshot is in the cucumber report
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (this.page) {
    this.attach(await this.page.screenshot(), "image/png");

    await this.page.close();
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  await this.context?.close();
});

AfterAll(resourceCleanup);
