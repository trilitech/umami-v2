import { render, screen, waitFor } from "../mocks/testUtils";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { request } from "../utils/datocms/request";

const fixture = () => <AnnouncementBanner />;

jest.mock("../utils/datocms/request");
const requestMock = request as jest.Mock;

beforeEach(async () => {
  await waitFor(
    () => {
      expect(screen.queryAllByText("successToastHeading").length).toBe(0);
    },
    { timeout: 50000 }
  );
});

describe("AnnouncementBanner", () => {
  it("displays text if a message has been set", async () => {
    requestMock.mockReturnValue({
      configuration: { maintenanceMessage: "hello" },
    });
    render(fixture());
    await waitFor(() => {
      expect(requestMock).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toBeInTheDocument();
    });
  });

  it("displays no text if a message is empty", async () => {
    requestMock.mockReturnValue({ configuration: { maintenanceMessage: "" } });
    render(fixture());
    await waitFor(() => {
      expect(requestMock).toBeCalledTimes(1);
    });
    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });
});
