import { Button } from "@chakra-ui/react";

import { ExitArrowIcon } from "../assets/icons";

export const CloseDrawerButton = ({ onClose }: { onClose: () => void }) => (
  <Button minWidth="24px" padding="0" onClick={onClose} variant="CTAWithIcon">
    <ExitArrowIcon stroke="currentcolor" />
  </Button>
);
