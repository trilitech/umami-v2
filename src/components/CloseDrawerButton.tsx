import { Button, Text } from "@chakra-ui/react";

import { ExitArrowIcon } from "../assets/icons";

export const CloseDrawerButton = ({ onClose }: { onClose: () => void }) => (
  <Button onClick={onClose} variant="CTAWithIcon">
    <ExitArrowIcon stroke="currentcolor" />
    <Text marginLeft="4px">Close</Text>
  </Button>
);
