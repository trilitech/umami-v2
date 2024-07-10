import "@testing-library/jest-dom";

const writeText = jest.fn();

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
});
