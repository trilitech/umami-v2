import { TezosNetwork } from "@airgap/tezos";
import { InMemorySigner } from "@taquito/signer";
import { seedPhrase } from "../mocks/seedPhrase";
import { SignerType } from "../types/SignerConfig";
import { getDefaultMnemonicDerivationPath } from "../utils/account/derivationPathUtils";
import { tezToMutez } from "../utils/format";
import { getPendingOperations } from "../utils/multisig/fetch";
import { makeToolkitWithSigner, transferMutez } from "../utils/tezos";
import { callContract } from "../utils/tezos/contract";
import { getBalancePayload } from "../utils/useAssetsPolling";
import { makeBatchLambda, parseMichelineExpression } from "./multisigUtils";

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

// Originated multisig
// threshold: 2
// singers: makeDevDefaultSigner(0), makeDevDefaultSigner(1)
const MULTISIG_GHOSTNET_1 = "KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8";
const MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP = 238447;

describe("multisig Sandbox", () => {
  test.skip("propose, approve and execute batch tez transfers", async () => {
    const TEZ_TO_SEND = 2;

    const toolkit0 = await makeToolkitFromDefaultDevSeed(0);
    const toolkit1 = await makeToolkitFromDefaultDevSeed(1);
    const devAccount2 = makeDevDefaultSigner(2);
    const devAccount2Pkh = await devAccount2.publicKeyHash();
    const devAccount2Sk = await devAccount2.secretKey();

    const { tez: preDevAccount2TezBalance } = await getBalancePayload(
      devAccount2Pkh,
      TezosNetwork.GHOSTNET
    );

    // First, devAccount2 send tez to MULTISIG_GHOSTNET_1
    const { fee } = await transferMutez(
      MULTISIG_GHOSTNET_1,
      tezToMutez(TEZ_TO_SEND.toString()).toNumber(),
      {
        type: SignerType.SK,
        sk: devAccount2Sk,
        network: TezosNetwork.GHOSTNET,
      }
    );
    await sleep(15000);

    // devAccount0 propose a simple tranfer back to devAccount2
    // devAccount0 is going to be in the approvers as well.
    const lamndaActions = await makeBatchLambda(
      [
        {
          type: "tez",
          recipient: devAccount2Pkh,
          amount: tezToMutez((TEZ_TO_SEND / 2).toString()).toString(),
        },
        {
          type: "tez",
          recipient: devAccount2Pkh,
          amount: tezToMutez((TEZ_TO_SEND / 2).toString()).toString(),
        },
      ],
      TezosNetwork.GHOSTNET
    );
    const proposeResponse = await callContract(
      {
        contract: MULTISIG_GHOSTNET_1,
        entrypoint: "propose",
        value: lamndaActions,
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
    const pendingOpKey = activeOps[activeOps.length - 1].key;
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

    const { tez: postDevAccount2TezBalance } = await getBalancePayload(
      devAccount2Pkh,
      TezosNetwork.GHOSTNET
    );

    expect(parseInt(postDevAccount2TezBalance) + fee).toEqual(
      parseInt(preDevAccount2TezBalance)
    );
  });
});
