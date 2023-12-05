import crypto from "crypto";

import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";
import { ChromiumBrowser, chromium } from "@playwright/test";

import { CustomWorld } from "./world";
import { killNode, resetBlockchain } from "../utils";

let browser: ChromiumBrowser;

BeforeAll(async function () {
  browser = await chromium.launch({ headless: false });
  global.crypto = crypto as any;
});

Before(async function (this: CustomWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();

  // TODO: setup local storage
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
