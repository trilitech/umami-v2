import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const DiamondIcon = (props: IconProps) => (
  <Icon
    width="24px"
    height="24px"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.125 9H20.875M12 3L8 9L12 20.6667L16 9L12 3ZM12.64 20.1467L20.64 9.48C20.7691 9.30787 20.8336 9.22181 20.8585 9.12728C20.8805 9.04385 20.8805 8.95615 20.8585 8.87272C20.8336 8.77819 20.7691 8.69213 20.64 8.52L16.74 3.32C16.652 3.20267 16.608 3.144 16.5522 3.10169C16.5028 3.06421 16.4469 3.03625 16.3873 3.01922C16.32 3 16.2467 3 16.1 3H7.9C7.75333 3 7.68 3 7.61269 3.01922C7.55308 3.03625 7.49715 3.06421 7.44776 3.10169C7.392 3.144 7.348 3.20267 7.26 3.32L3.36 8.52C3.2309 8.69213 3.16635 8.77819 3.14147 8.87271C3.11951 8.95615 3.11951 9.04385 3.14147 9.12728C3.16635 9.2218 3.2309 9.30787 3.36 9.48L11.36 20.1467C11.5771 20.4362 11.6857 20.5809 11.8188 20.6327C11.9353 20.678 12.0647 20.678 12.1812 20.6327C12.3143 20.5809 12.4229 20.4362 12.64 20.1467Z"
      stroke={colors.gray[450]}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
    />
  </Icon>
);
