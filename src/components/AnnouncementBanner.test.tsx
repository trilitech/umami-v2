import { userEvent } from "@testing-library/user-event";
import axios from "axios";

import { AnnouncementBanner } from "./AnnouncementBanner";
import { act, render, screen, waitFor } from "../mocks/testUtils";
import { announcementSlice } from "../utils/redux/slices/announcementSlice";
import { store } from "../utils/redux/store";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

describe("<AnnouncementBanner />", () => {
  it("doesn't show up if there's no announcement", () => {
    mockedAxios.get.mockResolvedValue({ data: "" });

    render(<AnnouncementBanner />);

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("doesn't show up if the message has been already seen", () => {
    mockedAxios.get.mockResolvedValue({ data: "" });

    render(<AnnouncementBanner />);

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("shows up if there's an announcement and it hasn't been seen", async () => {
    mockedAxios.get.mockResolvedValue({ data: "" });
    store.dispatch(announcementSlice.actions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />);

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });
  });

  it("hides the announcement when the close button is clicked", async () => {
    const user = userEvent.setup();
    mockedAxios.get.mockResolvedValue({ data: "test" });
    store.dispatch(announcementSlice.actions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />);

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });

    await act(() => user.click(screen.getByTestId("close")));

    expect(screen.queryByTestId("announcement")).not.toBeInTheDocument();
  });

  it("replaces the announcement when the new one is fetched", async () => {
    mockedAxios.get.mockResolvedValue({ data: "another-announcement" });
    store.dispatch(announcementSlice.actions.setCurrent("announcement-text"));

    render(<AnnouncementBanner />);

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("announcement-text");
    });

    await waitFor(() => {
      expect(screen.getByTestId("announcement")).toHaveTextContent("another-announcement");
    });
  });
});
