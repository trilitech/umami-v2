import { TezosNetwork } from "@airgap/tezos";
import axios from "axios";
import { ghostMultisigContracts } from "../../mocks/tzktResponse";
import { tzktUrls } from "../tezos/consts";
import { multisigAddress } from "./consts";
import { getAllMultiSigContracts } from "./fetch";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("multisig fetch", () => {
  test("getAllMultiSigContracts", async () => {
    mockedAxios.get.mockResolvedValue({ data: ghostMultisigContracts });

    const result = await getAllMultiSigContracts(TezosNetwork.GHOSTNET);
    expect(mockedAxios.get).toBeCalledWith(
      `${tzktUrls[TezosNetwork.GHOSTNET]}/v1/contracts/${
        multisigAddress[TezosNetwork.GHOSTNET]
      }/same?includeStorage=true&limit=10000`
    );
    expect(result).toEqual([
      {
        address: "KT1Mqvf7bnYe4Ty2n7ZbGkdbebCd4WoTJUUp",
        balance: 0,
        storage: {
          pending_ops: 216411,
          signers: ["tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3", "tz1dyX3B1CFYa2DfdFLyPtiJCfQRUgPVME6E"],
          threshold: "1",
        },
      },
      {
        address: "KT1VwWbTMRN5uX4bfxCcpJnPP6iAhboqhGZr",
        balance: 0,
        storage: {
          pending_ops: 219458,
          signers: [
            "tz1LbSsDSmekew3prdDGx1nS22ie6jjBN6B3",
            "tz1VTfGqp34NypRQJmjNiPrCTG5TRonevsmf",
            "tz1g2pCYFonfHXqjNCJNnGRy6MamDPdon4oS",
          ],
          threshold: "2",
        },
      },
      {
        address: "KT1Vdhz4izz7LASWU4tTLu3GBsvhJ8ULSi3G",
        balance: 0,
        storage: {
          pending_ops: 219535,
          signers: ["tz1RVPjF88wjiZ7JhxvmLPRm6TTR9MHPAFPd", "tz1ajzeMEzKxM9H4keBxoD1JSQy3iGRoHPg5"],
          threshold: "1",
        },
      },
    ]);
  });
});
