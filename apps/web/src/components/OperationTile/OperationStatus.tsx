import { useIsBlockFinalised } from "@umami/state";

import { CheckmarkIcon, CrossedCircleIcon, HourglassIcon } from "../../assets/icons";

export const OperationStatus = ({ level, status }: { level: number; status?: string }) => {
  const isFinalised = useIsBlockFinalised(level);

  // if we don't know the status we assume it's applied
  if (status === undefined || status === "applied") {
    if (isFinalised) {
      return <CheckmarkIcon data-testid="checkmark" />;
    } else {
      return <HourglassIcon data-testid="hourglass" />;
    }
  }
  return <CrossedCircleIcon data-testid="crossed-circle" />;
};
