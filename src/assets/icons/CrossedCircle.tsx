import { Icon, IconProps } from "@chakra-ui/react";

const CrossedCircleIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.773 13.773C14.9945 12.5515 15.75 10.864 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C7.13604 2.25 5.44854 3.00552 4.22703 4.22703M13.773 13.773C12.5515 14.9945 10.864 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 7.13604 3.00552 5.44854 4.22703 4.22703M13.773 13.773L4.22703 4.22703"
        stroke="#FB4F57"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Icon>
  );
};

export default CrossedCircleIcon;
