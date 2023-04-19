import { TezosNetwork } from "@airgap/tezos";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { mockPk, mockPkh } from "../../mocks/factories";
import { DummySigner } from "./dummySigner";
import {
  getPkAndPkhFromSk,
  makeToolkitWithDummySigner,
  makeToolkitWithSigner,
} from "./helpers";
import { SignerType, SkSignerConfig } from "../../types/SignerConfig";
jest.mock("@taquito/signer");
jest.mock("@taquito/taquito");
jest.mock("./dummySigner");

const mockSk = "mockSk";
describe("tezos utils helpers", () => {
  test("getPkAndPkhFromSk", async () => {
    await getPkAndPkhFromSk(mockSk);
    expect(InMemorySigner).toBeCalledTimes(1);
  });

  test("makeToolkitWithSigner", async () => {
    const config: SkSignerConfig = {
      network: TezosNetwork.GHOSTNET,
      type: SignerType.SK,
      sk: mockSk
    };
    makeToolkitWithSigner(config);
    expect(TezosToolkit).toBeCalledTimes(1);
    expect(InMemorySigner).toBeCalledTimes(1);
  });

  test("makeToolkitWithDummySigner", async () => {
    makeToolkitWithDummySigner(mockPk(0), mockPkh(0), TezosNetwork.GHOSTNET);
    expect(DummySigner).toBeCalledTimes(1);
    expect(TezosToolkit).toBeCalledTimes(1);
  });
});
