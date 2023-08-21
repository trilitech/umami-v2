import { FormControl } from "@chakra-ui/react";
import { AvailableSignersAutocomplete } from "../AddressAutocomplete";
import { FormOperations } from "../sendForm/types";
import { Account } from "../../types/Account";
import { RawPkh } from "../../types/Address";

export const OperationSignerSelector = ({
  sender,
  operationType,
  isDisabled,
  reEstimate,
}: {
  sender: Account;
  operationType: FormOperations["type"];
  isDisabled: boolean;
  reEstimate: (newSigner: RawPkh) => Promise<void>;
}) => {
  switch (operationType) {
    case "proposal":
      return (
        <FormControl data-testid="signer-selector">
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
