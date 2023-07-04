import { render, screen, waitFor } from "../mocks/testUtils";
import { AnnouncementBanner } from "./AnnouncementBanner";
import { request } from "../utils/datocms/request";

const fixture = () => <AnnouncementBanner />;

jest.mock("../utils/datocms/request");
const requestMock = request as jest.Mock;

describe("AnnouncementBanner", () => {
  // TODO: enable when AnnouncementBanner is fixed
  it.skip("displays text if a message has been set", async () => {
    requestMock.mockReturnValue({
      configuration: { maintenanceMessage: "hello" },
    });
    render(fixture());
    await waitFor(() => {
      expect(requestMock).toBeCalledTimes(1);
    });
    expect(await screen.findByTestId("announcement")).toHaveTextContent("hello");
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
