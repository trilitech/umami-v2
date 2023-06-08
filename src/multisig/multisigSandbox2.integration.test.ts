import { TezosNetwork } from "@airgap/tezos";
import { InMemorySigner } from "@taquito/signer";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { seedPhrase } from "../mocks/seedPhrase";
import { SignerType } from "../types/SignerConfig";
import { getDefaultMnemonicDerivationPath } from "../utils/account/derivationPathUtils";
import { mutezToTez, tezToMutez } from "../utils/format";
import { getPendingOperations } from "../utils/multisig/fetch";
import { makeToolkitWithSigner, transferMutez } from "../utils/tezos";
import { callContract } from "../utils/tezos/contract";
import { getBalancePayload } from "../utils/useAssetsPolling";
import { parseMichelineExpression } from "./multisigUtils";

jest.unmock("../utils/tezos");

jest.setTimeout(80000);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Make the same toolkit for dev mode.
// For example, makeToolkitForDefaultDevSeed(0) will create "restored account 0"
export const makeToolkitFromDefaultDevSeed = async (index: number) => {
  const sk = await makeDevDefaultSigner(index).secretKey();

  return makeToolkitWithSigner({
    sk,
    type: SignerType.SK,
    network: TezosNetwork.GHOSTNET,
  });
};

const makeDevDefaultSigner = (index: number) => {
  return InMemorySigner.fromMnemonic({
    mnemonic: seedPhrase,
    derivationPath: getDefaultMnemonicDerivationPath(index),
    curve: "ed25519",
  });
};

const getTezBalanceOnGhostNet = async (pkh: string) => {
  const mutez = await getBalancePayload(pkh, TezosNetwork.GHOSTNET);
  return mutezToTez(mutez.tez);
};

// Originated multisig
// threshold: 2
// singers: makeDevDefaultSigner(0), makeDevDefaultSigner(1)
const MULTISIG_GHOSTNET_1 = "KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8";
const MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP = 238447;

describe("multisig Sandbox", () => {
  test.only("propose, approve and execute simple tez transfer", async () => {
    const TEZ_TO_SEND = "2";

    const toolkit0 = await makeToolkitFromDefaultDevSeed(0);
    const toolkit1 = await makeToolkitFromDefaultDevSeed(1);
    const devAccount2 = makeDevDefaultSigner(2);
    const devAccount2Pkh = await devAccount2.publicKeyHash();
    const devAccount2Sk = await devAccount2.secretKey();

    const preDevAccount2TezBalance = await getTezBalanceOnGhostNet(
      devAccount2Pkh
    );

    // First, devAccount2 send tez to MULTISIG_GHOSTNET_1
    await transferMutez(
      MULTISIG_GHOSTNET_1,
      tezToMutez(TEZ_TO_SEND).toNumber(),
      {
        type: SignerType.SK,
        sk: devAccount2Sk,
        network: TezosNetwork.GHOSTNET,
      }
    );
    await sleep(15000);

    // devAccount0 propose a simple tranfer back to devAccount2 first
    // devAccount0 is going to be in the approvers as well.
    const lamndaAction = MANAGER_LAMBDA.transferImplicit(
      await devAccount2.publicKeyHash(),
      tezToMutez(TEZ_TO_SEND).toNumber()
    );
    const proposeResponse = await callContract(
      {
        contract: MULTISIG_GHOSTNET_1,
        entrypoint: "propose",
        value: lamndaAction,
        amount: 0,
      },
      toolkit0
    );

    expect(proposeResponse.hash).toBeTruthy();
    console.log("propose done");
    await sleep(15000);

    // get the operation id of the proposal.
    const pendingOps = await getPendingOperations(
      TezosNetwork.GHOSTNET,
      MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP
    );
    const activeOps = pendingOps.filter(({ active }) => active);
    expect(activeOps.length).toBeGreaterThanOrEqual(1);
    const pendingOpKey = activeOps[0].key;
    expect(pendingOpKey).toBeTruthy();

    // devAccount1 approves the proposal, meeting the threshold
    const approveResponse = await callContract(
      {
        contract: MULTISIG_GHOSTNET_1,
        entrypoint: "approve",
        value: parseMichelineExpression(pendingOpKey as string),
        amount: 0,
      },
      toolkit1
    );
    expect(approveResponse.hash).toBeTruthy();
    console.log("approve done");
    await sleep(15000);

    // The proposal to transfer to DevAccount2 can be executed
    const executeResponse = await callContract(
      {
        contract: MULTISIG_GHOSTNET_1,
        entrypoint: "execute",
        value: parseMichelineExpression(pendingOpKey as string),
        amount: 0,
      },
      toolkit0
    );

    expect(executeResponse.hash).toBeTruthy();
    console.log("execute done");
    await sleep(25000);

    const postDevAccount2TezBalance = await getTezBalanceOnGhostNet(
      devAccount2Pkh
    );

    expect(parseInt(preDevAccount2TezBalance)).toEqual(
      parseInt(postDevAccount2TezBalance)
    );
  });
});
