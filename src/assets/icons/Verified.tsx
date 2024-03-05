import { Flex, Icon, IconProps } from "@chakra-ui/react";

import colors from "../../style/colors";

export const VerifiedIcon: React.FC = () => (
  <Flex position="relative" alignItems="center" justifyContent="center" data-testid="verified-icon">
    <StarIcon />
    <Flex position="absolute" alignItems="center" justifyContent="center">
      <CheckIcon />
    </Flex>
  </Flex>
);

const StarIcon: React.FC<IconProps> = props => (
  <Icon
    width="14px"
    height="14px"
    fill={colors.gray[450]}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.51019 0.479749C6.78233 0.213196 7.21767 0.213195 7.48981 0.479749L8.86158 1.82333C8.99061 1.94972 9.16351 2.02134 9.34412 2.02321L11.2642 2.04314C11.6451 2.04709 11.9529 2.35492 11.9569 2.73584L11.9768 4.65588C11.9787 4.83649 12.0503 5.00939 12.1767 5.13842L13.5203 6.51019C13.7868 6.78233 13.7868 7.21767 13.5203 7.48981L12.1767 8.86158C12.0503 8.99061 11.9787 9.16351 11.9768 9.34412L11.9569 11.2642C11.9529 11.6451 11.6451 11.9529 11.2642 11.9569L9.34412 11.9768C9.16351 11.9787 8.99061 12.0503 8.86158 12.1767L7.48981 13.5203C7.21767 13.7868 6.78233 13.7868 6.51019 13.5203L5.13842 12.1767C5.00939 12.0503 4.83649 11.9787 4.65588 11.9768L2.73584 11.9569C2.35492 11.9529 2.04709 11.6451 2.04314 11.2642L2.02321 9.34412C2.02134 9.16351 1.94972 8.99061 1.82333 8.86158L0.479749 7.48981C0.213196 7.21767 0.213195 6.78233 0.479749 6.51019L1.82333 5.13842C1.94972 5.00939 2.02134 4.83649 2.02321 4.65588L2.04314 2.73584C2.04709 2.35492 2.35492 2.04709 2.73584 2.04314L4.65588 2.02321C4.83649 2.02134 5.00939 1.94972 5.13842 1.82333L6.51019 0.479749Z"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </Icon>
);

const CheckIcon: React.FC<IconProps> = props => (
  <Icon
    width="7px"
    height="5px"
    fill="none"
    stroke="white"
    viewBox="0 0 7 5"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.66699 2.19314L3.0281 3.55425L5.75033 0.832031"
      strokeLinecap="square"
      strokeLinejoin="round"
    />
  </Icon>
);
