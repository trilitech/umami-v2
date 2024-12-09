import {
  Button,
  type ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { type MouseEvent, type PropsWithChildren } from "react";

import { useColor } from "../../styles/useColor";

const COPY_TIMEOUT = 30_000;

type CopyButtonProps = {
  value: string;
  isCopyDisabled?: boolean;
  isDisposable?: boolean;
} & ButtonProps;

export const CopyButton = ({
  value,
  children,
  isCopyDisabled = false,
  isDisposable = false,
  ...props
}: PropsWithChildren<CopyButtonProps>) => {
  const color = useColor();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onClick = (event: MouseEvent) => {
    if (isCopyDisabled) {
      return;
    }

    event.stopPropagation();
    setTimeout(onClose, 1000);

    return navigator.clipboard.writeText(value).then(() => {
      if (isDisposable) {
        setTimeout(() => {
          try {
            void navigator.clipboard.writeText("");
          } catch (error: unknown) {
            console.error("Failed to clear clipboard", error);
          }
        }, COPY_TIMEOUT);
      }
    });
  };

  return (
    <Popover isOpen={isCopyDisabled ? false : isOpen} onClose={onClose} onOpen={onOpen}>
      <PopoverTrigger>
        <Button
          gap="4px"
          display="flex"
          width="fit-content"
          fontWeight="400"
          data-testid="copy-button"
          onClick={onClick}
          {...props}
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent maxWidth="max-content" background="white">
        <PopoverArrow background="white !important" />
        <PopoverBody>
          <Text color={color("black")} size="sm">
            Copied!
          </Text>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
