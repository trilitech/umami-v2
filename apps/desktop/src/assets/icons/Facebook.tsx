import { Icon, type IconProps } from "@chakra-ui/react";

export const FacebookIcon = (props: IconProps) => (
  <Icon
    width="28px"
    height="28px"
    fill="none"
    data-testid="facebook-icon"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M28 14.0856C28 6.30633 21.732 0 14 0C6.26801 0 0 6.30633 0 14.0856C0 21.1161 5.1196 26.9434 11.8125 28V18.1572H8.25781V14.0856H11.8125V10.9824C11.8125 7.45215 13.9026 5.50218 17.1005 5.50218C18.6322 5.50218 20.2344 5.77729 20.2344 5.77729V9.24367H18.469C16.7299 9.24367 16.1875 10.3294 16.1875 11.4434V14.0856H20.0703L19.4496 18.1572H16.1875V28C22.8804 26.9434 28 21.1161 28 14.0856Z"
      fill="#1977F2"
      clipRule="evenodd"
      fillRule="evenodd"
    />
    <path
      d="M19.4496 18.0469L20.0703 14H16.1875V11.3738C16.1875 10.2667 16.7299 9.1875 18.469 9.1875H20.2344V5.74219C20.2344 5.74219 18.6322 5.46875 17.1005 5.46875C13.9026 5.46875 11.8125 7.40687 11.8125 10.9156V14H8.25781V18.0469H11.8125V27.8299C13.262 28.0567 14.738 28.0567 16.1875 27.8299V18.0469H19.4496Z"
      fill="white"
      clipRule="evenodd"
      fillRule="evenodd"
    />
  </Icon>
);
