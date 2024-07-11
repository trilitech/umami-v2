import { Button, type ButtonProps } from "@chakra-ui/react";

type SendButtonProps = {
  onClick: () => void;
} & ButtonProps;

export const SendButton = ({ onClick, ...props }: SendButtonProps) => (
  <Button
    padding="10px 24px"
    borderRadius="full"
    onClick={onClick}
    size="lg"
    variant="primary"
    {...props}
  >
    Send
  </Button>
);
