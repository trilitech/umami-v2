import { Text } from "@chakra-ui/react";
import { differenceInDays, format, formatDistance } from "date-fns";

import { useColor } from "../../styles/useColor";

export const Timestamp = ({ timestamp }: { timestamp: string | undefined }) => {
  const color = useColor();
  if (!timestamp) {
    return null;
  }

  return (
    <Text color={color("gray.400")} data-testid="timestamp" size="sm">
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
  const timestampDate = new Date(timestamp);

  const dayDifference = differenceInDays(currentDate, timestampDate);

  if (dayDifference < 2) {
    return formatDistance(timestampDate, currentDate, { addSuffix: true });
  } else {
    return format(timestampDate, "dd MMM yyyy");
  }
};
