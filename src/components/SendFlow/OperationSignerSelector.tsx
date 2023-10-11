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
        <FormControl mt="24px" data-testid="signer-selector">
          <AvailableSignersAutocomplete
            account={sender}
            inputName="signer"
            label="Select Proposer"
            isLoading={isLoading}
            onUpdate={reEstimate}
            keepValid
          />
        </FormControl>
      );
    case "implicit":
      return null;
  }
};
