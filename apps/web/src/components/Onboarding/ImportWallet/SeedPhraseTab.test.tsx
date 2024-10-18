import { mockToast } from "@umami/state";
import { mnemonic1 } from "@umami/test-utils";

import { SeedPhraseTab } from "./SeedPhraseTab";
import { act, render, screen, userEvent } from "../../../testUtils";

jest.setTimeout(10000);

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

describe("<SeedPhraseTab />", () => {
  it("has 24 words by default", () => {
    render(<SeedPhraseTab />);

    expect(screen.getByText("24 word seed phrase")).toBeVisible();
    expect(screen.getAllByRole("textbox")).toHaveLength(24);
  });

  it("can change the number of words", async () => {
    const user = userEvent.setup();
    render(<SeedPhraseTab />);

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
    render(<SeedPhraseTab />);

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
      render(<SeedPhraseTab />);

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
      render(<SeedPhraseTab />);

      const textbox = screen.getAllByRole("textbox")[0];
      await act(() => user.click(textbox));

      await act(() => user.paste(mnemonic1));

      screen.getAllByRole("textbox").forEach((textbox, i) => {
        expect(textbox).toHaveValue(mnemonic1.split(" ")[i]);
      });
    });
  });

  describe("clear all", () => {
    it("clears all the words", async () => {
      const user = userEvent.setup();

      render(<SeedPhraseTab />);

      const textboxes = screen.getAllByRole("textbox");

      const textbox1 = textboxes[0];
      const textbox2 = textboxes[15];
      await act(() => user.type(textbox1, "something1"));
      await act(() => user.type(textbox2, "something2"));

      expect(textbox1).toHaveValue("something1");
      expect(textbox2).toHaveValue("something2");

      await act(() => user.click(screen.getByRole("button", { name: "Clear All" })));

      expect(textbox1).toHaveValue(undefined);
      expect(textbox2).toHaveValue(undefined);

      expect(screen.getAllByRole("textbox")).toHaveLength(24);
    });

    it("clears all the words when changing the number of words", async () => {
      const user = userEvent.setup();

      render(<SeedPhraseTab />);

      await act(() => user.click(screen.getByText("24 word seed phrase")));
      const changeTo12Button = await screen.findByRole("button", { name: "12" });
      await act(() => user.click(changeTo12Button));
      expect(screen.getAllByRole("textbox")).toHaveLength(12);

      await act(() => user.click(screen.getByRole("button", { name: "Clear All" })));

      expect(screen.getAllByRole("textbox")).toHaveLength(12);
    });
  });
});
