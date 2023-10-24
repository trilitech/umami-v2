import { Icon, IconProps } from "@chakra-ui/react";

const XMark: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
        data-testid="xmark-icon-path"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default XMark;
