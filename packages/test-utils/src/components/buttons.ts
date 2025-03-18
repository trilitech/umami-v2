import { screen } from "@testing-library/react";

export const getButtonByName = (name: string) => screen.getByRole("button", { name });
export const queryButtonByName = (name: string) => screen.queryByRole("button", { name });
