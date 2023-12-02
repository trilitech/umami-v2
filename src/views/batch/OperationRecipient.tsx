import { Text } from "@chakra-ui/react";

import { AddressPill } from "../../components/AddressPill/AddressPill";
import colors from "../../style/colors";
import { Operation } from "../../types/Operation";

export const OperationRecipient = ({ operation }: { operation: Operation }) => {
  let address;

  switch (operation.type) {
    case "undelegation":
    case "contract_origination":
      address = undefined;
      break;
    case "tez":
    case "fa1.2":
    case "fa2":
    case "delegation":
      address = operation.recipient;
      break;

    case "contract_call":
      address = operation.contract; // TODO: consider using recipient for the contract_call instead of contract
      break;
  }
  if (!address) {
    return (
      <Text color={colors.gray[500]} data-testid="recipient">
        N/A
      </Text>
    );
  }
  return (
    <>
      <Text marginRight="6px" color={colors.gray[450]}>
        To:
      </Text>
      <AddressPill address={address} data-testid="recipient" />
    </>
  );
};
