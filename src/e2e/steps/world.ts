import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";

/**
 * Custom cucumber context which allows us to use
 * the playwright context and page in our step definitions.
 */
export class CustomWorld extends World {
  constructor(options: IWorldOptions & { context: BrowserContext; page: Page }) {
    super(options);
    this.context = options.context;
    this.page = options.page;
  }
  context: BrowserContext;
  page: Page;
}

setWorldConstructor(CustomWorld);
