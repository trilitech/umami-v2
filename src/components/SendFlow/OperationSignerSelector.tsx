import { FormControl } from "@chakra-ui/react";
import { AvailableSignersAutocomplete } from "../AddressAutocomplete";
import { AccountOperations } from "../../types/AccountOperations";
import { Account } from "../../types/Account";
import { RawPkh } from "../../types/Address";

export const OperationSignerSelector = ({
  sender,
  operationType,
  isDisabled,
  reEstimate,
}: {
  sender: Account;
  operationType: AccountOperations["type"];
  isDisabled: boolean;
  reEstimate: (newSigner: RawPkh) => Promise<void>;
}) => {
  switch (operationType) {
    case "proposal":
      return (
        <FormControl mt="24px" data-testid="signer-selector">
          <AvailableSignersAutocomplete
            account={sender}
            inputName="signer"
            label="Select Proposer"
            isDisabled={isDisabled}
            onUpdate={reEstimate}
            keepValid
          />
        </FormControl>
      );
    case "implicit":
      return null;
  }
};
