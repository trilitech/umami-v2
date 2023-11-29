import { FormControl } from "@chakra-ui/react";
import { AvailableSignersAutocomplete } from "../AddressAutocomplete";
import { AccountOperations } from "../../types/AccountOperations";
import { Account } from "../../types/Account";
import { RawPkh } from "../../types/Address";

export const OperationSignerSelector = ({
  sender,
  operationType,
  isLoading,
  reEstimate,
}: {
  sender: Account;
  operationType: AccountOperations["type"];
  isLoading: boolean;
  reEstimate: (newSigner: RawPkh) => Promise<void>;
}) => {
  switch (operationType) {
    case "proposal":
      return (
        <FormControl marginTop="24px" data-testid="signer-selector">
          <AvailableSignersAutocomplete
            account={sender}
            inputName="signer"
            isLoading={isLoading}
            keepValid
            label="Select Proposer"
            onUpdate={reEstimate}
          />
        </FormControl>
      );
    case "implicit":
      return null;
  }
};
