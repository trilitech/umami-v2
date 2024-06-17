import { withRateLimit } from "./withRateLimit";

class HTTPErrorMock extends Error {
  status: number;
  data: string;
  constructor(status: number, data: string) {
    super(`Error ${status}`);
    this.status = status;
    this.data = data;
  }
}

describe("withRateLimit", () => {
  describe("retries", () => {
    it("retries the request 3 times", async () => {
      let counter = 0;
      const fn = async () => {
        counter++;
        if (counter < 4) {
          throw new Error("Some error");
        }
        return Promise.resolve("success");
      };

      await expect(withRateLimit(fn)).resolves.toEqual("success");
    });

    it("throws if the request fails on the 3rd attempt", async () => {
      let counter = 0;
      const fn = async () => {
        counter++;
        if (counter < 5) {
          throw new Error("Some error");
        }
        return Promise.resolve("success");
      };

      await expect(() => withRateLimit(fn)).rejects.toThrow("Some error");
    });
  });

  describe("errors", () => {
    it("handles common errors", async () => {
      const fn = () => Promise.reject(new Error("Some error"));

      await expect(() => withRateLimit(fn)).rejects.toThrow("Some error");
    });

    it("handles tzkt HTTP errors", async () => {
      const fn = () => {
        throw new HTTPErrorMock(504, "Gateway timeout");
      };

      await expect(() => withRateLimit(fn)).rejects.toThrow(
        "Fetching data from tzkt failed with: 504, Gateway timeout"
      );
    });
  });
});
