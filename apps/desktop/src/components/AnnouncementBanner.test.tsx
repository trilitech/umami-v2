import { type UmamiStore, announcementActions, makeStore } from "@umami/state";
import axios from "axios";

import { AnnouncementBanner } from "./AnnouncementBanner";
import { act, render, screen, userEvent, waitFor } from "../mocks/testUtils";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AnnouncementBanner />", () => {
  it("doesn't show up if there's no announcement", () => {
    mockedAxios.get.mockResolvedValue({ data: "" });

    render(<AnnouncementBanner />, { store });

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("doesn't show up if the message has been already seen", () => {
    mockedAxios.get.mockResolvedValue({ data: "" });

    render(<AnnouncementBanner />, { store });

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("shows up if there's an announcement and it hasn't been seen", async () => {
    mockedAxios.get.mockResolvedValue({ data: "" });
    store.dispatch(announcementActions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });
  });

  it("hides the announcement when the close button is clicked", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValue({ data: "test" });
    store.dispatch(announcementActions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />, { store });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });

    await act(() => user.click(screen.getByTestId("close")));

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("replaces the announcement when the new one is fetched", async () => {
    mockedAxios.get.mockResolvedValue({ data: "another-announcement" });
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
