import { Button, ButtonProps, Text } from "@chakra-ui/react";
import OutgoingArrow from "../assets/icons/OutgoingArrow";

export const SendButton: React.FC<
  {
    onClick: () => void;
  } & ButtonProps
> = ({ onClick, ...buttonProps }) => {
  return (
    <Button variant="specialCTA" width="60px" onClick={onClick} {...buttonProps}>
      <OutgoingArrow stroke="currentcolor" />
      <Text ml="4px">Send</Text>
    </Button>
  );
};

export default SendButton;
