import { makeAccountOperations } from "../../types/AccountOperations";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { render, screen, within } from "../../mocks/testUtils";
import { ghostFA2, ghostTezzard } from "../../mocks/tokens";
import { Operation } from "../../types/Operation";
import { BatchView, tokenTitle } from "./BatchView";

describe("<BatchView />", () => {
  test("header", () => {
    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockTezOperation(0),
    ]);
    render(<BatchView operations={operations} />);
    const header = screen.getByTestId("header");
    expect(header).toBeInTheDocument();
    expect(within(header).getByTestId("right-header")).toBeInTheDocument();
  });

  test("body", () => {
    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      mockTezOperation(0),
      mockTezOperation(0),
      mockTezOperation(0),
    ]);
    render(<BatchView operations={operations} />);
    expect(screen.getAllByTestId("operation").length).toEqual(3);
  });

  describe("footer", () => {
    it("is hidden until there are > 9 operations", () => {
      const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
        mockTezOperation(0),
      ]);
      render(<BatchView operations={operations} />);
      expect(screen.queryByTestId("footer")).not.toBeInTheDocument();
    });

    it("shows up when there are too many operations", () => {
      const ops: Operation[] = [];
      for (let i = 0; i < 10; i++) {
        ops.push(mockTezOperation(i));
      }
      const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), ops);
      render(<BatchView operations={operations} />);
      const footer = screen.getByTestId("footer");
      expect(within(footer).getByTestId("right-header")).toBeInTheDocument();
    });
  });
});

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
