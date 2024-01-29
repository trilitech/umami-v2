import { Center, Text } from "@chakra-ui/react";
import type { OperationContentsAndResult, OperationResultStatusEnum } from "@taquito/rpc";
import { get } from "lodash";

import { CheckmarkIcon, ExclamationIcon, WarningIcon } from "../../assets/icons";
import colors from "../../style/colors";

export const OperationEstimationStatus = ({
  estimationResult,
}: {
  estimationResult: OperationContentsAndResult | undefined;
}) => {
  if (!estimationResult) {
    return null;
  }
  const status = get(estimationResult, "metadata.operation_result.status") as
    | OperationResultStatusEnum
    | undefined;

  if (!status) {
    return null;
  }

  let icon: React.ReactNode;
  let textColor: string;
  let description: string;

  switch (status) {
    case "applied":
    case "backtracked":
      textColor = colors.green;
      description = "Estimated";
      icon = <CheckmarkIcon height="14.5px" />;
      break;
    case "failed":
      textColor = colors.orange;
      description = "Failed";
      icon = <WarningIcon width="13px" height="12px" stroke="currentcolor" />;
      break;
    case "skipped":
      textColor = colors.orangeL;
      description = "Not Estimated";
      icon = <ExclamationIcon stroke="currentcolor" />;
  }

  return (
    <Center marginTop="8px" color={textColor} data-testid="estimation-status">
      {icon}
      <Text marginLeft="4px" size="xs">
        {description}
      </Text>
    </Center>
  );
};
