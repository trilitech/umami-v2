import CheckmarkIcon from "../../assets/icons/Checkmark";
import CrossedCircleIcon from "../../assets/icons/CrossedCircle";
import HourglassIcon from "../../assets/icons/Hourglass";
import { useIsBlockFinalised } from "../../utils/hooks/assetsHooks";

export const OperationStatus: React.FC<{ level: number; status?: string }> = ({
  level,
  status,
}) => {
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
