import { Text } from "@chakra-ui/react";
import { Operation } from "../../types/Operation";
import colors from "../../style/colors";
import AddressPill from "../../components/AddressPill/AddressPill";

// TODO: add tests
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
      <Text data-testid="recipient" color={colors.gray[500]}>
        N/A
      </Text>
    );
  }
  return (
    <>
      <Text mr="6px" color={colors.gray[450]}>
        To:
      </Text>
      <AddressPill data-testid="recipient" address={address} />
    </>
  );
};
