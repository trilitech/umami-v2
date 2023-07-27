import { Icon, IconProps } from "@chakra-ui/react";

const FetchingIcon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.7842 8.29169C13.8165 8.03234 13.8332 7.76813 13.8332 7.50002C13.8332 4.00222 10.9976 1.16669 7.49984 1.16669C5.52021 1.16669 3.75273 2.07494 2.59135 3.49748M1.2155 6.70835C1.18316 6.9677 1.1665 7.23191 1.1665 7.50002C1.1665 10.9978 4.00203 13.8334 7.49984 13.8334C9.39143 13.8334 11.0893 13.0041 12.2498 11.6892M9.87484 11.4584H12.2498V11.6892M2.59135 1.16669V3.49748M2.59135 3.49748V3.54163L4.96635 3.54169M12.2498 13.8334V11.6892"
        stroke="#C2C2C2"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default FetchingIcon;
