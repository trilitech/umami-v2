import { Button } from "@chakra-ui/react";
import { type ReactNode } from "react";

import { FileCopyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

type CopyButtonProps = {
  value?: string;
  text?: ReactNode;
};

export const CopyButton = ({ value, text }: CopyButtonProps) => {
  const color = useColor();

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
  };

  return (
    <Button
      gap="4px"
      width="fit-content"
      padding="0"
      aria-label="Copy Address"
      onClick={handleCopy}
      variant="empty"
    >
      {text}
      <FileCopyIcon color={color("400")} />
    </Button>
  );
};
