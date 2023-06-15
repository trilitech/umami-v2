import { TezosNetwork } from "@airgap/tezos";
import { makeDefaultDevSigner } from "../mocks/devSignerKeys";
import { SignerType } from "../types/SignerConfig";
import { tezToMutez } from "../utils/format";
import { getPendingOperations } from "../utils/multisig/fetch";
import {
  approveOrExecuteMultisigOperation,
  estimateMultisigApproveOrExecute,
  estimateMultisigPropose,
  proposeMultisigLambda,
  transferMutez,
} from "../utils/tezos";
import { getBalancePayload } from "../utils/useAssetsPolling";
import { makeBatchLambda } from "./multisigUtils";

jest.unmock("../utils/tezos");

jest.setTimeout(90000);

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Originated multisig on ghostnet
// threshold: 2
// singers: makeDevDefaultSigner(0), makeDevDefaultSigner(1)
// Pre funded with FA1.2 token (KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe).
// KL2 FA2 token (KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ).
const MULTISIG_GHOSTNET_1 = "KT1GTYqMXwnsvqYwNGcTHcgqNRASuyM5TzY8";
const MULTISIG_GHOSTNET_1_PENDING_OPS_BIG_MAP = 238447;
const FA12_TOKEN_CONTRACT = "KT1UCPcXExqEYRnfoXWYvBkkn5uPjn8TBTEe";
const FA2_KL2_CONTRACT = "KT1XZoJ3PAidWVWRiKWESmPj64eKN7CEHuWZ";

describe("multisig Sandbox", () => {
  test.skip("propose, approve and execute batch tez/FA transfers", async () => {
    const TEZ_TO_SEND = 1;

    const devAccount0 = makeDefaultDevSigner(0);
    const devAccount1 = makeDefaultDevSigner(1);
    const devAccount2 = makeDefaultDevSigner(2);
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

    // devAccount0 propose a batch tez/FA tranfer to devAccount2
    // devAccount0 is going to be in the approvers as well.
    const lambdaActions = await makeBatchLambda(
      [
        {
          type: "tez",
          recipient: devAccount2Pkh,
          amount: tezToMutez(TEZ_TO_SEND.toString()).toString(),
        },
        {
          type: "fa1.2",
          sender: MULTISIG_GHOSTNET_1,
          recipient: devAccount2Pkh,
          contract: FA12_TOKEN_CONTRACT,
          amount: "2",
        },
        {
          type: "fa2",
          sender: MULTISIG_GHOSTNET_1,
          recipient: devAccount2Pkh,
          contract: FA2_KL2_CONTRACT,
          amount: "3",
          tokenId: "0",
        },
      ],
      TezosNetwork.GHOSTNET
    );

    const proposeEstimate = await estimateMultisigPropose(
      { contract: MULTISIG_GHOSTNET_1, lambdaActions },
      await devAccount0.publicKey(),
      await devAccount0.publicKeyHash(),
      TezosNetwork.GHOSTNET
    );
    expect(proposeEstimate).toHaveProperty("suggestedFeeMutez");

    const proposeResponse = await proposeMultisigLambda(
      { contract: MULTISIG_GHOSTNET_1, lambdaActions },
      {
        type: SignerType.SK,
        network: TezosNetwork.GHOSTNET,
        sk: await devAccount0.secretKey(),
      }
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
    const approveEstimate = await estimateMultisigApproveOrExecute(
      {
        type: "approve",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      await devAccount1.publicKey(),
      await devAccount1.publicKeyHash(),
      TezosNetwork.GHOSTNET
    );
    expect(approveEstimate).toHaveProperty("suggestedFeeMutez");

    const approveResponse = await approveOrExecuteMultisigOperation(
      {
        type: "approve",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      {
        type: SignerType.SK,
        network: TezosNetwork.GHOSTNET,
        sk: await devAccount1.secretKey(),
      }
    );
    expect(approveResponse.hash).toBeTruthy();
    console.log("approve done");
    await sleep(15000);

    // The proposal to transfer to DevAccount2 can be executed
    const executeEstimate = await estimateMultisigApproveOrExecute(
      {
        type: "execute",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      await devAccount1.publicKey(),
      await devAccount1.publicKeyHash(),
      TezosNetwork.GHOSTNET
    );
    expect(executeEstimate).toHaveProperty("suggestedFeeMutez");

    const executeResponse = await approveOrExecuteMultisigOperation(
      {
        type: "execute",
        contract: MULTISIG_GHOSTNET_1,
        operationId: pendingOpKey as string,
      },
      {
        type: SignerType.SK,
        network: TezosNetwork.GHOSTNET,
        sk: await devAccount1.secretKey(),
      }
    );
    expect(executeResponse.hash).toBeTruthy();
    console.log("execute done");
    await sleep(25000);

    const { tez: postDevAccount2TezBalance } = await getBalancePayload(
      devAccount2Pkh,
      TezosNetwork.GHOSTNET
    );

    expect(parseInt(postDevAccount2TezBalance) + fee).toEqual(parseInt(preDevAccount2TezBalance));
  });
});
