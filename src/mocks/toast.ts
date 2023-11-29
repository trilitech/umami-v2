export const mockToast = jest.fn();
(mockToast as any).close = jest.fn();

export const mockUseToast = () => {
  return mockToast;
};
