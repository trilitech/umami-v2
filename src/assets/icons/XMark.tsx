import { Icon, IconProps } from "@chakra-ui/react";

const XMark: React.FC<IconProps> = props => {
  return (
    <Icon width="3.5" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5"
        data-testid="xmark-icon-path"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default XMark;
