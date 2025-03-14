import { Button, type ButtonProps, Icon, Text } from "@chakra-ui/react";

import { CloseIcon } from "../../assets/icons";

type TagProps = {
  option: [string, string];
  onClick: () => void;
} & ButtonProps;

export const Tag = ({ option, onClick, ...props }: TagProps) => (
  <Button onClick={onClick} rightIcon={<Icon as={CloseIcon} />} variant="tag" {...props}>
    <Text
      overflow="hidden"
      maxWidth={{ base: "150px", md: "250px" }}
      whiteSpace="nowrap"
      textOverflow="ellipsis"
    >
      {option[1]}
    </Text>
  </Button>
);
