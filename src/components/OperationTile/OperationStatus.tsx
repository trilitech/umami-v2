import CheckmarkIcon from "../../assets/icons/Checkmark";
import CrossedCircleIcon from "../../assets/icons/CrossedCircle";
import HourglassIcon from "../../assets/icons/Hourglass";
import { useIsBlockFinalised } from "../../utils/hooks/assetsHooks";
import { TzktCombinedOperation } from "../../utils/tezos";

export const OperationStatus: React.FC<{ operation: TzktCombinedOperation }> = ({ operation }) => {
  const isFinalised = useIsBlockFinalised(operation.level);

  if (operation.status === "applied") {
    if (isFinalised) {
      return <CheckmarkIcon data-testid="checkmark" />;
    } else {
      return <HourglassIcon data-testid="hourglass" />;
    }
  }
  return <CrossedCircleIcon data-testid="crossed-circle" />;
};
