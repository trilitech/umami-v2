import { Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import colors from "../../style/colors";

export const Timestamp: React.FC<{ timestamp: string | undefined }> = ({ timestamp }) => {
  if (!timestamp) {
    return null;
  }
  const relativeTimestamp = formatRelative(new Date(timestamp as string), new Date());
  return (
    <Text data-testid="timestamp" color={colors.gray[400]}>
      {relativeTimestamp}
    </Text>
  );
};
