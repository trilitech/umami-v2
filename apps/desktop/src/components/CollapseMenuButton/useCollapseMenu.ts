import { useCallback, useState } from "react";

export const useCollapseMenu = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setIsCollapsed(isCollapsed => !isCollapsed);
  }, []);

  return {
    isCollapsed,
    toggle,
  };
};
