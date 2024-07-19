import { FormControl } from "@chakra-ui/react";
import { type Account, type AccountOperations } from "@umami/core";
import { type RawPkh } from "@umami/tezos";

import { AvailableSignersAutocomplete } from "../AddressAutocomplete";

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
