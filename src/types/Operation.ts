import { MichelsonV1Expression, TransactionOperationParameter } from "@taquito/rpc";
import { MANAGER_LAMBDA } from "@taquito/taquito";
import { isEqual } from "lodash";

import { Address, ContractAddress, ImplicitAddress } from "./Address";
import { ApproveOrExecute } from "../utils/tezos/types";

export type TezTransfer = {
  type: "tez";
  recipient: Address;
  amount: string; // TODO: enforce mutez format here
};

export type FA2Transfer = {
  type: "fa2";
  sender: Address;
  recipient: Address;
  contract: ContractAddress;
  tokenId: string;
  amount: string;
};

export type FA12Transfer = Omit<FA2Transfer, "type" | "tokenId"> & {
  type: "fa1.2";
  tokenId: "0";
};

export type Delegation = {
  type: "delegation";
  sender: Address;
  recipient: ImplicitAddress;
};

export type Undelegation = {
  type: "undelegation";
  sender: Address;
};

export type ContractOrigination = {
  type: "contract_origination";
  sender: Address;
  code: MichelsonV1Expression[];
  storage: any;
};

export type ContractCall = {
  type: "contract_call";
  contract: ContractAddress;
  amount: string;
  entrypoint: string;
  args: MichelsonV1Expression;
};

export type Operation =
  | TezTransfer
  | FA12Transfer
  | FA2Transfer
  | Delegation
  | Undelegation
  | ContractOrigination
  | ContractCall;

const LAMBDA_HEADER: MichelsonV1Expression[] = [
  { prim: "DROP" },
  { prim: "NIL", args: [{ prim: "operation" }] },
];

export const makeMultisigApproveOrExecuteOperation = (
  contract: ContractAddress,
  entrypoint: ApproveOrExecute,
  operationId: string
): ContractCall =>
  makeContractCallOperation(contract, entrypoint, {
    int: operationId,
  });

// Wraps the `proposableOperation` in a `ContractCall` to make proposal for a multisig contract.
// Note that the `proposedOperations` excludes `ContractOrigination` and `ContractCall` operations.
export const makeMultisigProposeOperation = (
  contract: ContractAddress,
  proposedOperations: Operation[]
): ContractCall => {
  const lambdaActions = toBatchLambda(proposedOperations);
  return makeContractCallOperation(contract, "propose", lambdaActions);
};

const makeContractCallOperation = (
  contract: ContractAddress,
  entrypoint: string,
  args: MichelsonV1Expression,
  amount = "0" // Most of the time, we don't need to send any tez on contract calls
): ContractCall => {
  return {
    type: "contract_call",
    contract,
    entrypoint,
    args,
    amount,
  };
};

export const headlessLambda = (lambda: MichelsonV1Expression[]): MichelsonV1Expression[] => {
  if (isEqual(lambda.slice(0, 2), LAMBDA_HEADER)) {
    return lambda.slice(2);
  }
  return lambda;
};

export const toLambda = (operation: Operation): MichelsonV1Expression[] => {
  switch (operation.type) {
    case "tez":
      switch (operation.recipient.type) {
        case "implicit":
          return MANAGER_LAMBDA.transferImplicit(operation.recipient.pkh, Number(operation.amount));
        case "contract":
          return MANAGER_LAMBDA.transferToContract(
            operation.recipient.pkh,
            Number(operation.amount)
          );
      }
    // eslint-disable-next-line no-fallthrough
    case "fa1.2":
      return contractLambda(
        operation,
        FA12_TRANSFER_ARG_TYPES,
        makeFA12TransactionParameter(operation)
      );
    case "fa2": {
      return contractLambda(
        operation,
        FA2_TRANSFER_ARG_TYPES,
        makeFA2TransactionParameter(operation)
      );
    }
    case "delegation":
      return MANAGER_LAMBDA.setDelegate(operation.recipient.pkh);
    case "undelegation":
      return MANAGER_LAMBDA.removeDelegate();
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not supported yet`);
  }
};

/**
 *
 * @param operations - List of JSON operations
 * @param network - Network is needed for fetching contract parameter elements in lambda
 * @returns Lambda in MichelsonJSON (=Micheline) format
 */

export const toBatchLambda = (operations: Operation[]) => {
  const opsLambdas = operations.map(operation => toLambda(operation)).flatMap(headlessLambda);

  return [...LAMBDA_HEADER, ...opsLambdas];
};

export const FA2_TRANSFER_ARG_TYPES: MichelsonV1Expression = {
  args: [
    {
      args: [
        {
          annots: ["%from_"],
          prim: "address",
        },
        {
          annots: ["%txs"],
          args: [
            {
              args: [
                {
                  annots: ["%to_"],
                  prim: "address",
                },
                {
                  args: [
                    {
                      annots: ["%token_id"],
                      prim: "nat",
                    },
                    {
                      annots: ["%amount"],
                      prim: "nat",
                    },
                  ],
                  prim: "pair",
                },
              ],
              prim: "pair",
            },
          ],
          prim: "list",
        },
      ],
      prim: "pair",
    },
  ],
  prim: "list",
};

export const FA12_TRANSFER_ARG_TYPES: MichelsonV1Expression = {
  args: [
    {
      annots: [":from"],
      prim: "address",
    },
    {
      args: [
        {
          annots: [":to"],
          prim: "address",
        },
        {
          annots: [":value"],
          prim: "nat",
        },
      ],
      prim: "pair",
    },
  ],
  prim: "pair",
};

const contractLambda = (
  operation: FA12Transfer | FA2Transfer,
  argTypes: MichelsonV1Expression,
  transactionParameter: TransactionOperationParameter
) => {
  return [
    ...LAMBDA_HEADER,
    {
      prim: "PUSH",
      args: [
        { prim: "address" },
        { string: operation.contract.pkh + "%" + transactionParameter.entrypoint },
      ],
    },
    {
      prim: "CONTRACT",
      args: [argTypes],
    },
    // If contract is not valid then fail and rollback the whole transaction
    [{ prim: "IF_NONE", args: [[{ prim: "UNIT" }, { prim: "FAILWITH" }], []] }],
    { prim: "PUSH", args: [{ prim: "mutez" }, { int: "0" }] },
    { prim: "PUSH", args: [argTypes, transactionParameter.value] },
    { prim: "TRANSFER_TOKENS" },
    { prim: "CONS" },
  ];
};
export const makeFA12TransactionParameter = ({
  sender,
  recipient,
  amount,
}: FA12Transfer): TransactionOperationParameter => ({
  entrypoint: "transfer",
  value: {
    prim: "Pair",
    args: [
      {
        string: sender.pkh,
      },
      {
        prim: "Pair",
        args: [
          {
            string: recipient.pkh,
          },
          {
            int: amount,
          },
        ],
      },
    ],
  },
});
export const makeFA2TransactionParameter = ({
  sender,
  recipient,
  tokenId,
  amount,
}: FA2Transfer): TransactionOperationParameter => ({
  entrypoint: "transfer",
  value: [
    {
      prim: "Pair",
      args: [
        {
          string: sender.pkh,
        },
        [
          {
            prim: "Pair",
            args: [
              {
                string: recipient.pkh,
              },
              {
                prim: "Pair",
                args: [
                  {
                    int: tokenId,
                  },
                  {
                    int: amount,
                  },
                ],
              },
            ],
          },
        ],
      ],
    },
  ],
});
