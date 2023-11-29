import { render, screen, waitFor } from "./mocks/testUtils";
import { request } from "./utils/datocms/request";
import { ImportSeed } from "./ImportSeed";

const fixture = () => <ImportSeed />;

jest.mock("./utils/datocms/request");
const requestMock = jest.mocked(request);

describe("ImportSeed", () => {
  it("Display slider items", async () => {
    requestMock.mockResolvedValue({
      allSlideritems: [
        {
          id: "1",
          title: "Slide 1",
          icon: "diamont",
          text: "asdf1234",
          image: {
            url: "https://www.datocms-assets.com/101901/1684941944-slider_1.png",
          },
        },
        {
          id: "2",
          title: "Slide 2",
          icon: "document",
          text: "something",
          image: {
            url: "https://www.datocms-assets.com/101901/1684941944-slider_1.png",
          },
        },
      ],
      _allSlideritemsMeta: { count: 2 },
    });
    render(fixture());
    await waitFor(() => {
      expect(requestMock).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("slide-1")).toHaveLength(2); // The slider library renders the slides twice
    });
    await waitFor(() => {
      expect(screen.queryAllByTestId("slide-2")).toHaveLength(2); // The slider library renders the slides twice
    });
    await waitFor(() => {
      expect(screen.queryByTestId("slide-3")).not.toBeInTheDocument();
    });
  });
});
