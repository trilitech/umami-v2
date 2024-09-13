import { Button, ModalFooter as Footer } from "@chakra-ui/react";
import { SettingsStore } from "@umami/state";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useSnapshot } from "valtio";
export interface LoaderProps {
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "white";
  active?: boolean;
}
interface Props {
  onApprove: () => void;
  onReject: () => void;
  infoBoxCondition?: boolean;
  infoBoxText?: string;
  approveLoader?: LoaderProps;
  rejectLoader?: LoaderProps;
  disableApprove?: boolean;
  disableReject?: boolean;
}

export default function ModalFooter({
  onApprove,
  approveLoader,
  onReject,
  rejectLoader,
  infoBoxCondition,
  infoBoxText,
  disableApprove,
  disableReject,
}: Props) {
  const { currentRequestVerifyContext } = useSnapshot(SettingsStore.state);
  const validation = currentRequestVerifyContext?.verified.validation;
  const form = useFormContext();

  const approveButtonColor: any = useMemo(() => {
    switch (validation) {
      case "INVALID":
        return "error";
      case "UNKNOWN":
        return "warning";
      default:
        return "success";
    }
  }, [validation]);

  return (
    <Footer>
      {infoBoxCondition && (
        <div style={{ textAlign: "initial" }}>
          <span>{infoBoxText || ""}</span>
        </div>
      )}
      <div className="flex justify-between items-center">
        <Button
          data-testid="session-reject-button"
          disabled={disableReject || rejectLoader?.active}
          onClick={onReject}
          style={{ color: "white", backgroundColor: "grey" }}
        >
          {rejectLoader && rejectLoader.active ? (
            "Loading..."
          ) : (
            "Reject"
          )}
        </Button>
        <Button
          color={approveButtonColor}
          data-testid="session-approve-button"
          disabled={disableApprove || approveLoader?.active || Boolean(form.formState.errors.password)}
          onClick={form.handleSubmit(onApprove)}
        >
          {approveLoader && approveLoader.active ? (
            "Loading..."
          ) : (
            "Approve"
          )}
        </Button>
      </div>
    </Footer>
  );
}
