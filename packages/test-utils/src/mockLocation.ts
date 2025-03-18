const originalWindowLocation = window.location;

export const mockWindowLocation = () => {
  delete (window as any).location;
  (window as any).location = {
    reload: jest.fn(),
    pathname: "",
  };
};

export const restoreOriginalWindowLocation = () => {
  delete (window as any).location;
  (window as any).location = originalWindowLocation;
};
