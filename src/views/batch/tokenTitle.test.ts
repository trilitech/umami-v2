import { tokenTitle } from "./tokenTitle";
import { ghostFA2, ghostTezzard } from "../../mocks/tokens";

describe("tokenTitle", () => {
  it("returns raw amount if token is missing", () => {
    expect(tokenTitle(undefined, "1000000")).toBe("1000000 Unknown Token");
  });

  it("doesn't return symbol if token name is absent", () => {
    expect(tokenTitle(ghostTezzard, "1000000")).toBe("1000000 Tezzardz #24");
  });

  it("returns symbol if name is absent", () => {
    const token = ghostTezzard;
    delete token.metadata.name;
    expect(tokenTitle(token, "1000000")).toBe("1000000 FKR");
  });

  it("returns just amount if neither name nor symbol are present", () => {
    expect(tokenTitle({ ...ghostTezzard, metadata: {} }, "1000000")).toBe("1000000");
  });

  it("returns pretty amount if decimals field is present", () => {
    expect(tokenTitle(ghostFA2, "1000321")).toBe("10.00321 Klondike3");
  });
});
