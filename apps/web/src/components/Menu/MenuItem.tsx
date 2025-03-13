import { Button, Flex, Icon, Text } from "@chakra-ui/react";

import { type TMenuItem } from "./types";
import { ChevronRightIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const MenuItem = ({
  label,
  icon,
  onClick,
  rightElement,
  hasArrow,
  style = {},
}: TMenuItem) => {
  const color = useColor();

  return (
    <Button
      alignItems="center"
      gap="10px"
      width="full"
      height="auto"
      padding="20px"
      color={color("400")}
      data-group
      onClick={onClick}
      variant="dropdownOption"
      {...style}
    >
      {icon}
      <Text marginRight="auto" color="gray.900" fontWeight="600" size="lg">
        {label}
      </Text>
      {hasArrow && (
        <Icon
          as={ChevronRightIcon}
          width="24px"
          height="24px"
          color={color("600")}
          _groupHover={{
            visibility: "visible",
          }}
          visibility="hidden"
        />
      )}
      {rightElement && <Flex onClick={e => e.stopPropagation()}>{rightElement}</Flex>}
    </Button>
  );
};
