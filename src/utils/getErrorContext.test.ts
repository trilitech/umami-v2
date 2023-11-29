import { getErrorContext } from "./getErrorContext";

describe("getErrorContext", () => {
  it("should get error context", () => {
    const { description, stacktrace } = getErrorContext({
      message: "some error message",
      stack: "some stacktrace",
    });
    expect(description).toEqual("some error message");
    expect(stacktrace).toEqual("some stacktrace");
  });
});
