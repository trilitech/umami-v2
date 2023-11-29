import { Text } from "@chakra-ui/react";
import { differenceInDays, format, formatDistance } from "date-fns";

import colors from "../../style/colors";

export const Timestamp: React.FC<{ timestamp: string | undefined }> = ({ timestamp }) => {
  if (!timestamp) {
    return null;
  }

  return (
    <Text color={colors.gray[400]} data-testid="timestamp" size="sm">
      {getDisplayTimestamp(timestamp)}
    </Text>
  );
};

// Display the time difference in minutes if it’s less than an hour,
// in hours if it’s less than a day,
// and in days if it’s less than two days.
// Otherwise, it will display the date in the dd MMM yyyy format
export const getDisplayTimestamp = (timestamp: string): string => {
  const currentDate = new Date();
  const timestampDate = new Date(timestamp as string);

  const dayDifference = differenceInDays(currentDate, timestampDate);

  if (dayDifference < 2) {
    return formatDistance(timestampDate, currentDate, { addSuffix: true });
  } else {
    return format(timestampDate, "dd MMM yyyy");
  }
};
