import { type Operations } from "@umami/core";

export interface SignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operations: Operations;
  mode: "single" | "batch";
  data?: unknown;
}
