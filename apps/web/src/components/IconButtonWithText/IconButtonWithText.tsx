import { Button, type ButtonProps, Circle, Heading, Icon } from "@chakra-ui/react";
import { type FunctionComponent, memo } from "react";

import { useColor } from "../../styles/useColor";

type IconButtonWithTextProps = {
  icon: FunctionComponent;
  label: string;
  variant: "primary" | "secondary";
} & Omit<ButtonProps, "variant">;

export const IconButtonWithText = memo(
  ({ icon, label, variant, ...props }: IconButtonWithTextProps) => {
    const color = useColor();

    const style = {
      primary: {
        circle: {
          _groupHover: { backgroundColor: color("blueDark") },
          backgroundColor: props.isDisabled ? color("100") : color("blue"),
        },
        icon: {
          color: props.isDisabled ? color("300") : color("white", "black"),
        },
      },
      secondary: {
        circle: {
          _groupHover: { backgroundColor: color("200") },
          backgroundColor: color("100"),
        },
        icon: {
          color: props.isDisabled ? color("300") : color("900"),
        },
      },
    }[variant];

    return (
      <Button
        justifyContent="space-between"
        flexDirection="column"
        gap="6px"
        padding="0"
        borderRadius="0"
        data-group
        size="lg"
        variant="empty"
        {...props}
      >
        <Circle {...style.circle} size="48px">
          <Icon as={icon} width="24px" height="24px" {...style.icon} />
        </Circle>
        <Heading
          color={props.isDisabled ? color("300") : color("900")}
          _groupHover={{ color: color("700") }}
          size="sm"
        >
          {label}
        </Heading>
      </Button>
    );
  }
);

IconButtonWithText.displayName = "IconButtonWithText";
