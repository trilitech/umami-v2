import { type ButtonProps, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { type FunctionComponent, memo } from "react";

import { useColor } from "../../styles/useColor";

type IconButtonWithTextProps = {
  icon: FunctionComponent;
  label: string;
  href?: string;
  isExternal?: boolean;
} & ButtonProps;

export const IconButtonWithText = memo(({ icon, label, ...props }: IconButtonWithTextProps) => {
  const color = useColor();

  return (
    <Flex alignItems="center" justifyContent="space-between" flexDirection="column" gap="6px">
      <IconButton
        borderRadius="full"
        aria-label={label}
        icon={<Icon as={icon} width="24px" height="24px" />}
        size="lg"
        {...props}
      />
      <Heading color={props.isDisabled ? color("300") : color("900")} size="sm">
        {label}
      </Heading>
    </Flex>
  );
});

IconButtonWithText.displayName = "IconButtonWithText";
