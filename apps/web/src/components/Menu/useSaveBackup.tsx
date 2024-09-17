import { useDynamicModalContext } from "@umami/components";

import { SetupPassword } from "../Onboarding/SetupPassword";

export const useSaveBackup = () => {
  const { openWith } = useDynamicModalContext();

  return () => openWith(<SetupPassword mode="save_backup" />);
};
