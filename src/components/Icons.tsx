import { createIcon } from "@chakra-ui/icons";

import colors from "../style/colors";

const defaultPathProps = {
  stroke: colors.gray[450],
  fill: "none" as const,
  strokeWidth: "1.2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const maintanceIcon = createIcon({
  displayName: "Maintance",
  viewBox: "0 0 18 18",
  path: (
    <path
      d="M12.182 5.8181C13.9393 7.57546 13.9393 10.4247 12.182 12.1821M5.81802 12.182C4.06066 10.4247 4.06066 7.57543 5.81802 5.81807M3.6967 14.3034C0.767767 11.3744 0.767767 6.62571 3.6967 3.69678M14.3033 3.69681C17.2322 6.62574 17.2322 11.3745 14.3033 14.3034M10.5 9.00008C10.5 9.82851 9.82843 10.5001 9 10.5001C8.17157 10.5001 7.5 9.82851 7.5 9.00008C7.5 8.17165 8.17157 7.50008 9 7.50008C9.82843 7.50008 10.5 8.17165 10.5 9.00008Z"
      {...defaultPathProps}
    />
  ),
});
