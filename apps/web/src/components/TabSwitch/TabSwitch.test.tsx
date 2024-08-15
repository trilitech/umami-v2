import { TabPanel, TabPanels, Tabs, useBreakpointValue } from "@chakra-ui/react";

import { TabSwitch } from "./TabSwitch";
import { act, render, screen, userEvent, waitFor, within } from "../../testUtils";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

describe("<TabSwitch />", () => {
  describe("on mobile", () => {
    beforeEach(() => jest.mocked(useBreakpointValue).mockReturnValue(true));

    it("renders accordion", () => {
      render(
        <Tabs>
          <TabSwitch options={["1", "2", "3"]} />
        </Tabs>
      );

      expect(screen.getByTestId("tab-switch-accordion")).toBeVisible();
      expect(screen.queryByTestId("tab-switch-tabs")).not.toBeInTheDocument();
    });

    it("renders all options in accordion", async () => {
      const user = userEvent.setup();
      render(
        <Tabs>
          <TabSwitch options={["option 1", "option 2", "option 3"]} />
        </Tabs>
      );

      await act(() => user.click(screen.getByTestId("tab-switch-accordion-button")));

      const panel = screen.getByTestId("tab-switch-accordion-panel");
      await waitFor(() => expect(panel).toBeVisible());
      expect(within(panel).getByText("option 1")).toBeVisible();
      expect(within(panel).getByText("option 2")).toBeVisible();
      expect(within(panel).getByText("option 3")).toBeVisible();
    });

    it("renders current default tab", () => {
      render(
        <Tabs index={2}>
          <TabSwitch options={["option 1", "option 2", "option 3"]} />
          <TabPanels>
            <TabPanel>panel 1</TabPanel>
            <TabPanel>panel 2</TabPanel>
            <TabPanel>panel 3</TabPanel>
          </TabPanels>
        </Tabs>
      );

      expect(screen.getByText("panel 3")).toBeVisible();
      expect(screen.getByText("panel 1")).not.toBeVisible();
      expect(screen.getByText("panel 2")).not.toBeVisible();

      expect(screen.getByTestId("tab-switch-accordion-button")).toHaveTextContent("option 3");
    });

    it("updates the current tab", () => {
      render(
        <Tabs index={2}>
          <TabSwitch options={["option 1", "option 2", "option 3"]} />
          <TabPanels>
            <TabPanel>panel 1</TabPanel>
            <TabPanel>panel 2</TabPanel>
            <TabPanel>panel 3</TabPanel>
          </TabPanels>
        </Tabs>
      );
    });
  });

  it("renders tabs on desktop", () => {
    jest.mocked(useBreakpointValue).mockReturnValue(false);
    render(
      <Tabs>
        <TabSwitch options={["1", "2", "3"]} />
      </Tabs>
    );

    expect(screen.queryByTestId("tab-switch-accordion")).not.toBeInTheDocument();
    expect(screen.getByTestId("tab-switch-tabs")).toBeVisible();
  });
});
