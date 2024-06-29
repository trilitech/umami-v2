import { Text, Tooltip } from "@chakra-ui/react";
import { truncate } from "@umami/tezos";
import type React from "react";

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
