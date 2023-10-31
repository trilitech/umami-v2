import { Text } from "@chakra-ui/react";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import colors from "../../style/colors";

export const Timestamp: React.FC<{ timestamp: string | undefined }> = ({ timestamp }) => {
  if (!timestamp) {
    return null;
  }

  return (
    <Text data-testid="timestamp" size="sm" color={colors.gray[400]}>
      {getDisplayTimestamp(timestamp)}
    </Text>
  );
};

// Display the time difference in minutes if it’s less than an hour, 
// in hours if it’s less than a day, 
// and in days if it’s less than two days. 
// Otherwise, it will display the date in the dd MMM yyyy format
export const getDisplayTimestamp = (timestamp:string): string  => {
  const currentDate = new Date();
  const timestampDate = new Date(timestamp as string);

  const minuteDifference = differenceInMinutes(currentDate, timestampDate);
  const hourDifference = differenceInHours(currentDate, timestampDate);
  const dayDifference = differenceInDays(currentDate, timestampDate);

  if (minuteDifference < 60) {
    return `${minuteDifference} minutes ago`;
  } else if (hourDifference < 24) {
    return `${hourDifference} hours ago`;
  } else if (dayDifference < 2) {
    return `${dayDifference} days ago`;
  } else {
    return format(timestampDate, 'dd MMM yyyy');
  }
}
