import { mockToast } from "@umami/state";
import { mnemonic1, mnemonic12 } from "@umami/test-utils";

import { SeedPhraseTab } from "./SeedPhraseTab";
import { act, render, screen, userEvent, waitFor } from "../../../testUtils";

jest.setTimeout(10000);

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

describe("<SeedPhraseTab />", () => {
  it("has 24 words by default", () => {
    render(<SeedPhraseTab />);

    expect(screen.getByText("24 word seed phrase")).toBeVisible();
    expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(24);
  });

  it("can change the number of words", async () => {
    const user = userEvent.setup();
    render(<SeedPhraseTab />);

    await act(() => user.click(screen.getByText("24 word seed phrase")));
    const changeTo12Button = await screen.findByRole("button", { name: "12" });
    await act(() => user.click(changeTo12Button));

    expect(screen.queryByText("24 word seed phrase")).not.toBeInTheDocument();
    expect(screen.getByText("12 word seed phrase")).toBeVisible();
    expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(12);

    const changeTo15Button = await screen.findByRole("button", { name: "15" });
    await act(() => user.click(changeTo15Button));

    expect(screen.queryByText("24 word seed phrase")).not.toBeInTheDocument();
    expect(screen.queryByText("12 word seed phrase")).not.toBeInTheDocument();
    expect(screen.getByText("15 word seed phrase")).toBeVisible();
    expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(15);
  });

  it("validates the presence of the words", async () => {
    const user = userEvent.setup();
    render(<SeedPhraseTab />);

    const submitButton = screen.getByRole("button", { name: "Next" });

    for (let i = 0; i < 24; i++) {
      expect(submitButton).toBeDisabled();
      await act(() => user.type(screen.getAllByTestId("mnemonic-input")[i], `word${i}`));
    }
    expect(submitButton).toBeEnabled();
  });

  describe("paste", () => {
    it("shows an error when incorrect number of words were pasted", async () => {
      const user = userEvent.setup();
      render(<SeedPhraseTab />);

      const textbox = screen.getAllByTestId("mnemonic-input")[0];
      await act(() => user.click(textbox));
      await act(() => user.paste("asd lasd"));

      expect(mockToast).toHaveBeenCalledWith({
        status: "error",
        isClosable: true,
        description: "the mnemonic must be 12, 15, 18, 21, 24 words long",
      });
    });

    it("changes the number of words on paste", async () => {
      const user = userEvent.setup();

      render(<SeedPhraseTab />);

      expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(24);

      expect(screen.getByText("24 word seed phrase")).toBeInTheDocument();
      expect(screen.queryByText("12 word seed phrase")).not.toBeInTheDocument();

      const textbox = screen.getAllByTestId("mnemonic-input")[0];
      await act(() => user.click(textbox));
      await act(() => user.paste(`${mnemonic12} `));

      await waitFor(() => {
        expect(screen.getByText("12 word seed phrase")).toBeInTheDocument();
      });
      expect(screen.queryByText("24 word seed phrase")).not.toBeInTheDocument();

      expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(12);
    });

    it("trims and fills in the form by paste button", async () => {
      const user = userEvent.setup({});
      render(<SeedPhraseTab />);

      const textbox = screen.getAllByTestId("mnemonic-input")[0];
      await act(() => user.click(textbox));

      await act(() => user.paste(`${mnemonic1} `));

      screen.getAllByTestId("mnemonic-input").forEach((textbox, i) => {
        expect(textbox).toHaveValue(mnemonic1.split(" ")[i]);
      });
    });
  });

  describe("clear", () => {
    it("clears all the words", async () => {
      const user = userEvent.setup();

      render(<SeedPhraseTab />);

      const textboxes = screen.getAllByTestId("mnemonic-input");

      const textbox1 = textboxes[0];
      const textbox2 = textboxes[15];
      await act(() => user.type(textbox1, "something1"));
      await act(() => user.type(textbox2, "something2"));

      expect(textbox1).toHaveValue("something1");
      expect(textbox2).toHaveValue("something2");

      await act(() => user.click(screen.getByText("24 word seed phrase")));
      const changeTo12Button = await screen.findByRole("button", { name: "12" });
      await act(() => user.click(changeTo12Button));

      await act(() => user.click(screen.getByRole("button", { name: "Clear" })));

      expect(textbox1).toHaveValue(undefined);
      expect(textbox2).toHaveValue(undefined);

      await act(() => user.click(screen.getByText("12 word seed phrase")));
      const changeTo24Button = await screen.findByRole("button", { name: "24" });
      await act(() => user.click(changeTo24Button));

      expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(24);
    });

    it("clears all the words when changing the number of words", async () => {
      const user = userEvent.setup();

      render(<SeedPhraseTab />);

      await act(() => user.click(screen.getByText("24 word seed phrase")));
      const changeTo12Button = await screen.findByRole("button", { name: "12" });
      await act(() => user.click(changeTo12Button));
      expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(12);

      await act(() => user.click(screen.getByRole("button", { name: "Clear" })));

      expect(screen.getAllByTestId("mnemonic-input")).toHaveLength(12);
    });
  });
});
