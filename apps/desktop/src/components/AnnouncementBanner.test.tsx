import { type UmamiStore, announcementActions, makeStore } from "@umami/state";

import { AnnouncementBanner } from "./AnnouncementBanner";
import { act, render, screen, userEvent, waitFor } from "../mocks/testUtils";

const mockedFetch = jest.spyOn(global, "fetch");

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AnnouncementBanner />", () => {
  it("doesn't show up if there's no announcement", () => {
    mockedFetch.mockResolvedValue({ json: () => Promise.resolve("") } as Response);

    render(<AnnouncementBanner />, { store });

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("doesn't show up if the message has been already seen", () => {
    mockedFetch.mockResolvedValue({ json: () => Promise.resolve("") } as Response);

    render(<AnnouncementBanner />, { store });

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("shows up if there's an announcement and it hasn't been seen", async () => {
    mockedFetch.mockResolvedValue({ json: () => Promise.resolve("") } as Response);
    store.dispatch(announcementActions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });
  });

  it("hides the announcement when the close button is clicked", async () => {
    const user = userEvent.setup();
    mockedFetch.mockResolvedValue({ json: () => Promise.resolve("test") } as Response);
    store.dispatch(announcementActions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });

    await act(() => user.click(screen.getByTestId("close")));

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("replaces the announcement when the new one is fetched", async () => {
    mockedFetch.mockResolvedValue({
      json: () => Promise.resolve("another-announcement"),
    } as Response);
    store.dispatch(announcementActions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("another-announcement");
    });
  });
});
