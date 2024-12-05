import { getErrorContext } from "./ErrorContext";
import { handleTezError } from "./estimate";

jest.mock("./estimate", () => ({
  handleTezError: jest.fn(),
}));

describe("getErrorContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle error object with message and stack", () => {
    jest.mocked(handleTezError).mockReturnValue(undefined);
    const error = {
      message: "some error message",
      stack: "some stacktrace",
    };

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("some error message");
    expect(context.stacktrace).toBe("some stacktrace");
    expect(context.description).toBe(
      "Something went wrong. Please try again or contact support if the issue persists."
    );
    expect(context.timestamp).toBeDefined();
  });

  it("should handle string errors", () => {
    jest.mocked(handleTezError).mockReturnValue(undefined);
    const error = "string error message";

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("string error message");
    expect(context.stacktrace).toBe("");
    expect(context.description).toBe(
      "Something went wrong. Please try again or contact support if the issue persists."
    );
    expect(context.timestamp).toBeDefined();
  });

  it("should handle Error instances with Tezos-specific errors", () => {
    jest.mocked(handleTezError).mockReturnValue("Handled tez error message");
    const error = new Error("test error");

    const context = getErrorContext(error);

    expect(context.technicalDetails).toBe("test error");
    expect(context.description).toBe("Handled tez error message");
    expect(context.stacktrace).toBeDefined();
    expect(context.timestamp).toBeDefined();
  });
});
