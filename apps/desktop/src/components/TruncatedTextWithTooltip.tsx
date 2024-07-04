import { Text, Tooltip } from "@chakra-ui/react";
import { truncate } from "@umami/tezos";

export const TruncatedTextWithTooltip = ({
  text,
  maxLength,
}: {
  text: string;
  maxLength: number;
}) => {
  if (text.length <= maxLength) {
    return <Text data-testid="truncated-text">{text}</Text>;
  }
  return (
    <Tooltip label={text}>
      <Text data-testid="truncated-text">{truncate(text, maxLength)}</Text>
    </Tooltip>
  );
};
