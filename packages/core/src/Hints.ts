import { type SignPage } from "./Titles";

type HintData = {
  header?: string;
  description?: string;
};
const basicOperationHeader = undefined;
const basicOperationDescription = undefined;

const finalizationConsequences =
  "Finalized funds are returned to your balance, allowing you to spend them or stake them again to earn rewards. Delegation rewards for these funds stop once they are finalized.";
const unstakingConsequences = `The unstaking process takes 4 cycles (~10 days) to unlock your staked funds, making them finalizable on request. You will receive delegation rewards for finalizable funds. ${finalizationConsequences}`;

export const Hints: Record<SignPage, HintData> = {
  TezSignPage: {
    header: basicOperationHeader,
    description: basicOperationDescription,
  },
  OriginationOperationSignPage: {
    header: basicOperationHeader,
    description: basicOperationDescription,
  },
  ContractCallSignPage: {
    header: basicOperationHeader,
    description: basicOperationDescription,
  },
  DelegationSignPage: {
    header: "It takes 2 cycles (~6 days) to start receiving delegation rewards.",
    description:
      "Bakers typically distribute delegation rewards every cycle (~3 days). Ensure the delegation fee offered by the baker is less than 100%; otherwise, you may not receive rewards. Delegation means that all your funds are delegated to one baker. The funds remain spendable, and you can cancel or change the delegation at any time.",
  },
  UndelegationSignPage: {
    header: "Stops both delegation and staking. Restoring rewards takes 2 cycles (~6 days).",
    description: `Undelegation takes effect immediately. However, you will still receive delegation rewards for the current and the next 2 cycles, as baking rights are computed 2 cycles in advance. By undelegating, you also initiate the unstaking process if you have staked. ${unstakingConsequences}`,
  },
  StakeSignPage: {
    header: "You will start receiving rewards within 1 cycle (~3 days).",
    description: `Your spendable balance will be reduced by the amount staked. You will start accruing staking rewards within 1 cycle (~3 days). Staking rewards are compounded on your staked balance. You can cancel staking any time. ${unstakingConsequences}`,
  },
  UnstakeSignPage: {
    header: "Takes at least 4 cycles (~10 days) to complete.",
    description: unstakingConsequences,
  },
  FinalizeUnstakeSignPage: {
    header: "Takes 1 block (8 seconds) to complete.",
    description: `Finalizing applies to all finalizable funds in your balance. ${finalizationConsequences}`,
  },
};
