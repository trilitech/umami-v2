import { InMemorySigner } from "@taquito/signer";
import { getPkAndPkhFromSk } from "./helpers";
jest.mock("@taquito/signer");
jest.mock("@taquito/taquito");
jest.mock("./dummySigner");

const mockSk = "mockSk";
describe("tezos utils helpers", () => {
  test("getPkAndPkhFromSk", async () => {
    await getPkAndPkhFromSk(mockSk);
    expect(InMemorySigner).toBeCalledTimes(1);
  });

  // test("makeToolkitWithSigner", async () => {
  //   makeToolkitWithSigner(mockSk, TezosNetwork.GHOSTNET);
  //   expect(TezosToolkit).toBeCalledTimes(1);
  //   expect(InMemorySigner).toBeCalledTimes(1);
  // });

  // test("makeToolkitWithDummySigner", async () => {
  //   makeToolkitWithDummySigner(mockPk(0), mockPkh(0), TezosNetwork.GHOSTNET);
  //   expect(DummySigner).toBeCalledTimes(1);
  //   expect(TezosToolkit).toBeCalledTimes(1);
  // });
});
