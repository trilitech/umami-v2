import { Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import { mockToast } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { SeedPhraseTabPanel } from "./SeedPhraseTabPanel";
import { act, render, screen, userEvent } from "../../../testUtils";

const TestComponent = () => (
  <Tabs defaultIndex={0}>
    <TabList>
      <Tab>Seed Phrase</Tab>
    </TabList>
    <TabPanels>
      <SeedPhraseTabPanel />
    </TabPanels>
  </Tabs>
);

jest.setTimeout(10000);

describe("<SeedPhraseTabPanel />", () => {
  it("has 24 words by default", () => {
    render(<TestComponent />);

    expect(screen.getByText("24 word seed phrase")).toBeVisible();
    expect(screen.getAllByRole("textbox")).toHaveLength(24);
  });

  it("can change the number of words", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    await act(() => user.click(screen.getByText("24 word seed phrase")));
    const changeTo12Button = await screen.findByRole("button", { name: "12" });
    await act(() => user.click(changeTo12Button));

    expect(screen.queryByText("24 word seed phrase")).not.toBeInTheDocument();
    expect(screen.getByText("12 word seed phrase")).toBeVisible();
    expect(screen.getAllByRole("textbox")).toHaveLength(12);

    const changeTo15Button = await screen.findByRole("button", { name: "15" });
    await act(() => user.click(changeTo15Button));

    expect(screen.queryByText("24 word seed phrase")).not.toBeInTheDocument();
    expect(screen.queryByText("12 word seed phrase")).not.toBeInTheDocument();
    expect(screen.getByText("15 word seed phrase")).toBeVisible();
    expect(screen.getAllByRole("textbox")).toHaveLength(15);
  });

  it("validates the presence of the words", async () => {
    const user = userEvent.setup();
    render(<TestComponent />);

    const submitButton = screen.getByRole("button", { name: "Next" });

    for (let i = 0; i < 24; i++) {
      expect(submitButton).toBeDisabled();
      await act(() => user.type(screen.getAllByRole("textbox")[i], `word${i}`));
    }
    expect(submitButton).toBeEnabled();
  });

  describe("paste", () => {
    it("shows an error when incorrect number of words were pasted", async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      const textbox = screen.getAllByRole("textbox")[0];
      await act(() => user.click(textbox));
      await act(() => user.paste("asd lasd"));

      expect(mockToast).toHaveBeenCalledWith({
        status: "error",
        isClosable: true,
        description: "the mnemonic must be 12, 15, 18, 21, 24 words long",
      });
    });

    it("fills in the form automatically", async () => {
      const user = userEvent.setup({});
      render(<TestComponent />);

      const textbox = screen.getAllByRole("textbox")[0];
      await act(() => user.click(textbox));

      await act(() => user.paste(mnemonic1));

      screen.getAllByRole("textbox").forEach((textbox, i) => {
        expect(textbox).toHaveValue(mnemonic1.split(" ")[i]);
      });
    });
  });
});
