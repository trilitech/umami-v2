export const mockLocalStorage = () => {
  Object.defineProperty(window, "localStorage", {
    value: mockStorage(),
  });
};

export const mockSessionStorage = () => {
  Object.defineProperty(window, "sessionStorage", {
    value: mockStorage(),
  });
};

const mockStorage = () => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};
