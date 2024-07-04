import { IconButton } from "@chakra-ui/react";

import { FileCopyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

type CopyButtonProps = {
  value?: string;
};

export const CopyButton = ({ value }: CopyButtonProps) => {
  const color = useColor();

  const handleCopy = async () => {
    if (!value) {
      return;
    }

    await navigator.clipboard.writeText(value);
  };

  return (
    <IconButton
      width="fit-content"
      aria-label="Copy Address"
      icon={<FileCopyIcon color={color("400")} />}
      onClick={handleCopy}
      variant="empty"
    />
  );
};
