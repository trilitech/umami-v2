import { Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { truncate } from "../utils/format";

export const TruncatedTextWithTooltip: React.FC<{
  text: string;
  maxLength: number;
}> = ({ text, maxLength }) => {
  if (text.length <= maxLength) {
    return <Text data-testid="truncated-text">{text}</Text>;
  }
  return (
    <Tooltip label={text}>
      <Text data-testid="truncated-text">{truncate(text, maxLength)}</Text>
    </Tooltip>
  );
};
