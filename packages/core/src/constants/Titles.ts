export type SignPage = keyof typeof Titles;
export const Titles: Record<string, string> = {
  tez: "Send request",
  contract_call: "Contract call request",
  delegation: "Delegation request",
  undelegation: "Undelegation request",
  contract_origination: "Origination request",
  stake: "Stake request",
  unstake: "Unstake request",
  finalize_unstake: "Finalize unstake Request",
  batch: "Batch request",
};
