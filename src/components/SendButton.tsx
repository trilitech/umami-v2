import { Button, ButtonProps, Text } from "@chakra-ui/react";

import { OutgoingArrow } from "../assets/icons";

export const SendButton: React.FC<
  {
    onClick: () => void;
  } & ButtonProps
> = ({ onClick, ...buttonProps }) => (
  <Button width="60px" onClick={onClick} variant="specialCTA" {...buttonProps}>
    <OutgoingArrow stroke="currentcolor" />
    <Text marginLeft="4px">Send</Text>
  </Button>
);
