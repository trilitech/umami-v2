import { useIsBlockFinalised } from "@umami/state";
import { memo } from "react";

import { CheckmarkIcon, CrossedCircleIcon, HourglassIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const OperationStatus = memo(({ level, status }: { level: number; status?: string }) => {
  const isFinalised = useIsBlockFinalised(level);
  const color = useColor();

  // if we don't know the status we assume it's applied
  if (status === undefined || status === "applied") {
    if (isFinalised) {
      return <CheckmarkIcon color={color("green")} data-testid="checkmark" />;
    } else {
      return <HourglassIcon color={color("red")} data-testid="hourglass" />;
    }
  }
  return <CrossedCircleIcon color={color("red")} data-testid="crossed-circle" />;
});
