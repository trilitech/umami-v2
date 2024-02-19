import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

import { CheckmarkIcon, HourglassIcon } from "../../../../assets/icons";
import colors from "../../../../style/colors";

export type MultisigSignerState =
  | "awaitingApprovalByExternalSigner"
  | "approved"
  | "executable"
  | "approvable";

export const MultisigActionButton: React.FC<{
  signerState: MultisigSignerState;
  approveOrExecute: () => void;
  isLoading: boolean;
}> = ({ approveOrExecute, isLoading, signerState }) => {
  switch (signerState) {
    case "awaitingApprovalByExternalSigner": {
      return (
        <Flex
          alignItems="center"
          alignSelf="flex-end"
          data-testid="multisig-signer-awaiting-approval"
        >
          <Text marginRight="4px" color={colors.gray[300]}>
            Awaiting Approval
          </Text>
          <HourglassIcon marginTop="2px" />
        </Flex>
      );
    }
    case "approved": {
      return (
        <Flex
          alignItems="center"
          alignSelf="flex-end"
          marginBottom="8px"
          data-testid="multisig-signer-approved"
        >
          <Text marginRight="4px" color={colors.gray[300]}>
            Approved
          </Text>
          <CheckmarkIcon marginTop="2px" />
        </Flex>
      );
    }
    case "executable": {
      return (
        <Button
          data-testid="multisig-signer-button"
          isLoading={isLoading}
          onClick={approveOrExecute}
        >
          Execute
        </Button>
      );
    }

    case "approvable": {
      return (
        <Button
          data-testid="multisig-signer-button"
          isLoading={isLoading}
          onClick={approveOrExecute}
        >
          Approve
        </Button>
      );
    }
  }
};
