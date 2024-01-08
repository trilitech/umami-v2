import crypto from "crypto";

import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { ChromiumBrowser, chromium } from "@playwright/test";
import { omit } from "lodash";

import { BASE_URL } from "./onboarding";
import { CustomWorld } from "./world";
import { initialState as accountsInitialState } from "../../utils/redux/slices/accountsSlice";
import { initialState as assetsInitialState } from "../../utils/redux/slices/assetsSlice";
import { initialState as batchesInitialState } from "../../utils/redux/slices/batches";
import { initialState as beaconInitialState } from "../../utils/redux/slices/beaconSlice";
import { initialState as contactsInitialState } from "../../utils/redux/slices/contactsSlice";
import { initialState as errorsInitialState } from "../../utils/redux/slices/errorsSlice";
import { initialState as multisigsInitialState } from "../../utils/redux/slices/multisigsSlice";
import { initialState as tokensInitialState } from "../../utils/redux/slices/tokensSlice";
import { TEST_NETWORKS_STATE, killNode, resetBlockchain } from "../utils";

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: !!process.env.CI, devtools: false });

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
    const predefinedState = await this.getReduxState();
    const accounts = predefinedState["accounts"] || accountsInitialState;
    const state: any = {
      assets: assetsInitialState,
      batches: batchesInitialState,
      beacon: beaconInitialState,
      contacts: contactsInitialState,
      errors: errorsInitialState,
      multisigs: multisigsInitialState,
      networks: TEST_NETWORKS_STATE,
      tokens: tokensInitialState,
      ...omit(predefinedState, "accounts"),
    };

    const prepareObjForRedux = (obj: any): void => {
      // without this redux considers the object to be malformed
      // and overrides it with the default state
      obj["_persist"] = '{"version":-1,"rehydrated":true}';

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
              // TODO: add a way to pass in the accounts (they are stored under persist:accounts)
              { name: "persist:root", value: JSON.stringify(state) },
              { name: "persist:accounts", value: JSON.stringify(accounts) },
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
  // helps with debugging failing tests
  // the screenshot is in the cucumber report
  this.attach(await this.page.screenshot(), "image/png");

  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
  killNode();
});
