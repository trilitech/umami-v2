import { TezosNetwork } from "@airgap/tezos";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { ghostnetFA12 } from "../mocks/fa12Tokens";
import { ghotnetThezard } from "../mocks/nftTokens";
import { publicKeys1, publicKeys2, publicKeys3 } from "../mocks/publicKeys";
import { ghostTezzard } from "../mocks/tokens";
import { SignerType } from "../types/SignerConfig";
import { makeToolkitWithSigner } from "../utils/tezos";
import { contract, makeStorageMichelsonJSON } from "./multisigContract";
import { makeBatchLambda } from "./multisigUtils";
import { MultisigStorage } from "./types";

jest.unmock("../utils/tezos");

export const makeToolkit = () =>
  makeToolkitWithSigner({
    sk: publicKeys1.sk,
    type: SignerType.SK,
    network: TezosNetwork.GHOSTNET,
  });

const originate = async () => {
  const tezos = await makeToolkit();

  return tezos.contract.originate({
    code: contract,
    init: makeStorageMichelsonJSON(publicKeys1.pkh, [publicKeys1.pkh], "1"),
  });
};

// Originated multisig contract
const multisigContract = "KT1MYis2J1hpjxVcfF92Mf7AfXouzaxsYfKm";

describe("multisig Sandbox", () => {
  test.skip("orgination", async () => {
    const result = await originate();
    expect(result.hash).toBeTruthy();
  });

  describe("Case simple tez transaction", () => {
    test.skip("send tez to contract", async () => {
      const toolkit = await makeToolkit();
      const result = await toolkit.contract.transfer({
        amount: 3356789,
        to: multisigContract,
        mutez: true,
      });
      expect(result.hash).toBeTruthy();
    });

    test.skip("make a simple tez transfer proposal", async () => {
      const proposeSimpleTez = async (recipient: string, mutez: number) => {
        const tezos = await makeToolkit();
        const transaction = MANAGER_LAMBDA.transferImplicit(recipient, mutez);
        const contract = await tezos.contract.at(multisigContract);
        return contract.methods["propose"](transaction).send();
      };

      const result = await proposeSimpleTez(publicKeys3.pkh, 20000);

      expect(result.hash).toBeTruthy();
    });

    test.skip("fetch proposals of contract", async () => {
      const toolkit = await makeToolkit();
      const contract = await toolkit.contract.at(multisigContract);
      const storage = (await contract.storage()) as MultisigStorage;
      const result = await storage.pending_ops.get(2);

      const proposedLambda = MANAGER_LAMBDA.transferImplicit(
        publicKeys3.pkh,
        9651
      );

      const proposal2Result = {
        actions: [
          { prim: "DROP" },
          { prim: "NIL", args: [{ prim: "operation" }] },
          {
            prim: "PUSH",
            args: [
              { prim: "key_hash" },
              { string: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS" },
            ],
          },
          { prim: "IMPLICIT_ACCOUNT" },
          { prim: "PUSH", args: [{ prim: "mutez" }, { int: "9651" }] },
          { prim: "UNIT" },
          { prim: "TRANSFER_TOKENS" },
          { prim: "CONS" },
        ],
        approvals: ["tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"],
      };
      expect(proposedLambda).toEqual(proposal2Result.actions);
      expect(result).toEqual(proposal2Result);
    });

    test.skip("aprove a proposal", async () => {
      const toolkit = await makeToolkit();
      const contract = await toolkit.contract.at(multisigContract);
      const proposalIndex = 3;
      const result = await contract.methods["approve"](proposalIndex).send();
      expect(result.hash).toBeTruthy();
    });
  });

  describe("Batch", () => {
    test.skip("generate proposal with tez and thezard", async () => {
      const tezos = await makeToolkit();

      const batch = await makeBatchLambda(
        [
          { type: "tez", amount: "600000", recipient: publicKeys2.pkh },
          {
            type: "fa1.2",
            amount: "300",
            recipient: publicKeys3.pkh,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            contract: ghostnetFA12!.token!.contract!.address!,
            sender: multisigContract,
          },
          {
            type: "fa2",
            amount: "1",
            recipient: publicKeys3.pkh,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            contract: ghotnetThezard!.token!.contract!.address!,
            sender: multisigContract,
            tokenId: ghostTezzard.tokenId,
          },
          { type: "tez", amount: "910000", recipient: publicKeys2.pkh },
          { type: "tez", amount: "2000", recipient: publicKeys3.pkh },
        ],

        TezosNetwork.GHOSTNET
      );

      const contract = await tezos.contract.at(multisigContract);
      const result = await contract.methods["propose"](batch).send();
      expect(result.hash).toBeTruthy();
    });
  });
});

test.skip("execute", async () => {
  const toolkit = await makeToolkit();
  const contract = await toolkit.contract.at(multisigContract);
  const proposalIndex = 24;
  const result = await contract.methods["execute"](proposalIndex).send();
  expect(result.hash).toBeTruthy();
});
