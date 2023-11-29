import { render, screen } from "@testing-library/react";

import { PrettyNumber } from "./PrettyNumber";

const fixture = (number: string) => <PrettyNumber number={number} />;

describe("<PrettyNumber />", () => {
  it("displays tez amount", () => {
    render(fixture("123.4567"));
    expect(screen.getByText(`123`)).toBeInTheDocument();
    expect(screen.getByText(`.4567`)).toBeInTheDocument();
  });

  it("displays decimals for whole number", () => {
    render(fixture("2000000"));
    expect(screen.getByText(`2000000`)).toBeInTheDocument();
    expect(screen.queryByText(`.`)).not.toBeInTheDocument();
  });
});
