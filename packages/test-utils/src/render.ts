export const checkElementsRenderInCorrectOrder = (getters: (() => HTMLElement)[]) => {
  for (let i = 1; i < getters.length; i++) {
    const currentMenuItem = getters[i]();
    const previousMenuItem = getters[i - 1]();
    try {
      expect(previousMenuItem.compareDocumentPosition(currentMenuItem)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    } catch {
      throw new Error(
        `"${previousMenuItem.textContent}" should appear before "${currentMenuItem.textContent}"`
      );
    }
  }
};
