import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";

/**
 * Custom cucumber context which allows us to use
 * the playwright context and page in our step definitions.
 *
 * Make sure to call the following functions in your step definitions:
 * - {@link setEmptyReduxState} or {@link setReduxState} - to pass initial state to {@link e2e/steps/hooks#Before} hook.
 * - await {@link pageReady} - to make sure app is initialized with the redux state and ready to be tested.
 */
export class CustomWorld extends World {
  constructor(options: IWorldOptions & { context: BrowserContext; page: Page }) {
    super(options);
    this.context = options.context;
    this._page = options.page;

    this.reduxStatePromise = new Promise<Record<string, any>>(resolve => {
      this.reduxStateResolve = resolve;
    });

    this.pageReady = new Promise<boolean>(resolve => {
      this.pageReadyResolve = resolve;
    });
  }
  context: BrowserContext;
  private _page: Page;

  /**
   * App's initial state.
   *
   * The promise resolves once the redux state has been set up.
   */
  private reduxStatePromise: Promise<Record<string, any>>;
  private reduxStateResolve: undefined | ((val: Record<string, any>) => void);

  /**
   * Promise that resolves once the page has been opened and is ready to be used.
   *
   * Should be awaited in the first step definition,
   * otherwise, the scenario will fail with `this.page is undefined`.
   */
  pageReady: Promise<boolean>;
  private pageReadyResolve: undefined | ((val: boolean) => void);

  public get page(): Page {
    return this._page;
  }

  /**
   * Sets the page and resolves {@link pageReady} promise.
   */
  public set page(page: Page) {
    this._page = page;
    this.pageReadyResolve!(true);
  }

  /** Returns promise that resolves once the redux state has been set up. */
  getReduxState(): Promise<Record<string, any>> {
    return this.reduxStatePromise;
  }

  /**
   * Sets and resolves {@link reduxStatePromise} with an empty initial app state.
   *
   * Either this or {@link setReduxState} should be called in the first step definition.
   */
  setEmptyReduxState(): void {
    this.setReduxState({});
  }

  /**
   * Sets and resolves {@link reduxStatePromise} with the given initial app state.
   *
   * Either this or {@link setEmptyReduxState} should be called in the first step definition.
   */
  setReduxState(state: Record<string, any>): void {
    this.reduxStateResolve!(state);
  }
}

setWorldConstructor(CustomWorld);
