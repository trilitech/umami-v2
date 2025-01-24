import { type SignPage } from "./Titles";

type HintData = {
  header?: string;
  description?: string;
};

const finalizationConsequences =
  "Finalizing unstaked funds makes them available on your spendable balance. They can now be spent or staken again to earn more rewards.";
const unstakingConsequences = `Unstaked tez immediately stop accruing staking rewards, but sill give rights to delegation rewards. Unstaked tez remain locked for up to 4 cycles (~11 days), after which they can be finalized on request. ${finalizationConsequences}`;

export const Hints: Record<SignPage, HintData> = {
  DelegationSignPage: {
    header: "It takes at least 3 full cycles (~9 days) to start receiving delegation rewards",
    description:
      "The actual delay will depend on your chosen baker payout strategy. Bakers typically distribute delegation rewards every cycle (~3 days). Ensure the delegation fee offered by the baker is less than 100%; otherwise, you may not receive rewards. Delegation means that all your funds are delegated to one baker. The funds remain spendable, and you can cancel or change the delegation at any time.",
  },
  UndelegationSignPage: {
    header: "Stops both delegation and staking. Restoring rewards takes 2 cycles (~6 days).",
    description: `Undelegation takes effect immediately. However, you will still receive delegation rewards for the current and the next 2 cycles, as baking rights are computed 2 cycles in advance. By undelegating, you also initiate the unstaking process if you have staked. ${unstakingConsequences}`,
  },
  StakeSignPage: {
    header: "You will start receiving rewards immediately (within the current cycle)",
    description: `Your spendable balance will be reduced by the amount staked. You will start accruing staking rewards immediately (within the current cycle). Staking rewards are compounded on your staked balance. You can cancel staking any time. ${unstakingConsequences}`,
  },
  UnstakeSignPage: {
    header:
      "Unstake request take effect immediately, but funds remain frozen for up to 4 cycles (~10 days)",
    description: unstakingConsequences,
  },
  FinalizeUnstakeSignPage: {
    header: "Takes 1 block (8 seconds) to complete.",
    description: `Finalizing applies to all finalizable funds in your balance. ${finalizationConsequences}`,
  },
};
