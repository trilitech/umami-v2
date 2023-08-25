import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import { backButtonStyle } from "../style/theme/modal";

export const ModalBackButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    {...backButtonStyle}
    variant="ghost"
    size="sm"
    aria-label="Back"
    icon={<ArrowBackIcon width="24px" height="20px" />}
    onClick={onClick}
  />
);
