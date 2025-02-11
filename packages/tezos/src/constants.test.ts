import { TEZ } from "./constants";

describe("TEZ", () => {
  it("should return ꜩ by default", () => {
    expect(TEZ).toBe("ꜩ");
  });

  it("should return XTZ for iOS", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
    });

    let constants: any;

    // Need to isolate the module to make it use the mocked navigator before importing the constants
    jest.isolateModules(() => {
      // eslint-disable-next-line
      constants = require("./constants");
    });

    expect(constants.TEZ).toBe("XTZ");
  });
});
