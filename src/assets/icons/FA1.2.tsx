import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";

export const FA12Icon: React.FC<IconProps> = props => {
  return (
    <Icon
      width="30px"
      height="15px"
      fill={colors.gray[450]}
      viewBox="1 1 30 15"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M1.2429 13V4.27273H7.02131V5.79403H3.08807V7.87358H6.63778V9.39489H3.08807V13H1.2429ZM8.67685 13H6.69957L9.71236 4.27273H12.0902L15.0987 13H13.1214L10.9354 6.26705H10.8672L8.67685 13ZM8.55327 9.5696H13.2237V11.0099H8.55327V9.5696ZM19.4847 4.27273V13H17.6396V6.02415H17.5884L15.5898 7.27699V5.64062L17.7504 4.27273H19.4847ZM22.1683 13.1108C21.8871 13.1108 21.6456 13.0114 21.4439 12.8125C21.245 12.6108 21.1456 12.3693 21.1456 12.0881C21.1456 11.8097 21.245 11.571 21.4439 11.3722C21.6456 11.1733 21.8871 11.0739 22.1683 11.0739C22.4411 11.0739 22.6797 11.1733 22.8842 11.3722C23.0888 11.571 23.1911 11.8097 23.1911 12.0881C23.1911 12.2756 23.1428 12.4474 23.0462 12.6037C22.9524 12.7571 22.8288 12.8807 22.6754 12.9744C22.522 13.0653 22.353 13.1108 22.1683 13.1108ZM24.6644 13V11.6705L27.771 8.79403C28.0352 8.53835 28.2567 8.30824 28.4357 8.10369C28.6175 7.89915 28.7553 7.69886 28.8491 7.50284C28.9428 7.30398 28.9897 7.08949 28.9897 6.85938C28.9897 6.60369 28.9315 6.38352 28.815 6.19886C28.6985 6.01136 28.5394 5.8679 28.3377 5.76847C28.136 5.66619 27.9073 5.61506 27.6516 5.61506C27.3846 5.61506 27.1516 5.66903 26.9528 5.77699C26.7539 5.88494 26.6005 6.03977 26.4925 6.24148C26.3846 6.44318 26.3306 6.68324 26.3306 6.96165H24.5792C24.5792 6.39062 24.7085 5.89489 24.967 5.47443C25.2255 5.05398 25.5877 4.72869 26.0536 4.49858C26.5195 4.26847 27.0565 4.15341 27.6644 4.15341C28.2894 4.15341 28.8335 4.2642 29.2965 4.4858C29.7624 4.70455 30.1246 5.00852 30.3832 5.39773C30.6417 5.78693 30.771 6.23295 30.771 6.7358C30.771 7.06534 30.7056 7.39062 30.5749 7.71165C30.4471 8.03267 30.2184 8.3892 29.8888 8.78125C29.5593 9.17045 29.0948 9.63778 28.4954 10.1832L27.2212 11.4318V11.4915H30.886V13H24.6644Z" />
    </Icon>
  );
};
