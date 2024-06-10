import { addDays, addHours, addMinutes, addSeconds, format } from "date-fns";

import { Timestamp, getDisplayTimestamp } from "./Timestamp";
import { render, screen } from "../../mocks/testUtils";

describe("<Timestamp />", () => {
  describe("component", () => {
    it("doesn't render if timestamp is undefined", () => {
      render(<Timestamp timestamp={undefined} />);

      expect(screen.queryByTestId("timestamp")).not.toBeInTheDocument();
    });

    it("renders the relative timestamp", () => {
      render(<Timestamp timestamp="2021-09-24T15:00:00.000Z" />);

      expect(screen.getByTestId("timestamp")).toHaveTextContent("24 Sep 2021");
    });
  });

  describe("getDisplayTimestamp", () => {
    it("should return seconds ago if less than a minute", () => {
      const timestamp = new Date();
      const testTimestamp = addSeconds(timestamp, -30).toISOString();
      expect(getDisplayTimestamp(testTimestamp)).toBe("1 minute ago");
    });

    it("should return minutes ago if less than an hour", () => {
      const timestamp = new Date();
      const testTimestamp = addMinutes(timestamp, -30).toISOString();
      expect(getDisplayTimestamp(testTimestamp)).toBe("30 minutes ago");
    });

    it("should return hours ago if less than a day", () => {
      const timestamp = new Date();
      const testTimestamp = addHours(timestamp, -5).toISOString();
      expect(getDisplayTimestamp(testTimestamp)).toBe("about 5 hours ago");
    });

    it("should return days ago if less than two days", () => {
      const timestamp = new Date();
      const testTimestamp = addDays(timestamp, -1).toISOString();
      expect(getDisplayTimestamp(testTimestamp)).toBe("1 day ago");
    });

    it("should return date in dd MMM yyyy format if more than two days ago", () => {
      const timestamp = new Date();
      const testTimestamp = addDays(timestamp, -3).toISOString();
      const formattedDate = format(new Date(testTimestamp), "dd MMM yyyy");
      expect(getDisplayTimestamp(testTimestamp)).toBe(formattedDate);
    });
  });
});
