import { Icon, IconProps } from "@chakra-ui/react";

const FlipForwardEnergy: React.FC<IconProps> = props => {
  return (
    <Icon
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="black"
      {...props}
    >
      <path
        d="M2.95314 5.997C4.05824 3.77605 6.35091 2.25 9 2.25C12.4718 2.25 15.3314 4.87105 15.708 8.24231M2.2912 9.74998C2.66427 13.125 5.52558 15.75 9 15.75C11.6496 15.75 13.9427 14.2234 15.0475 12.0017M2.25 3V6.375H5.625M15.75 15.375V12H12.375M8.625 6.75L7.5 9H10.5L9.375 11.25"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default FlipForwardEnergy;
