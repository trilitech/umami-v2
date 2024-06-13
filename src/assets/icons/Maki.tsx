import { Icon, type IconProps } from "@chakra-ui/react";

export const MakiIcon: React.FC<IconProps & { fishColor: string }> = ({ fishColor, ...props }) => (
  <Icon
    width="38px"
    height="38px"
    fill="none"
    viewBox="0 0 38 38"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M34.9985 26.2751C34.6599 26.8629 34.2436 27.4106 33.7512 27.9032C32.2815 29.3727 30.3277 30.1819 28.2496 30.1819H24.8477V34.9996H26.8032H28.2497C30.0524 34.9996 31.7472 34.2976 33.022 33.0229C34.2967 31.7481 34.9986 30.0533 34.9985 28.2507V26.2751Z"
      fill="black"
    />
    <path
      d="M34.9989 20.9441C34.6603 21.5318 34.2439 22.0796 33.7514 22.572C32.2819 24.0416 30.328 24.8509 28.2499 24.8509H18.9983C17.8104 24.8511 16.8477 25.814 16.8477 27.0019C16.8477 28.1898 17.8104 29.1528 18.9983 29.153H28.25C30.0526 29.153 31.7474 28.4511 33.0222 27.1763C34.2965 25.902 34.9986 24.2076 34.9989 22.4054V20.9441ZM18.9988 27.8361C18.5381 27.8361 18.1645 27.4626 18.1645 27.0018C18.1645 26.5412 18.5381 26.1675 18.9988 26.1675C19.4596 26.1675 19.8331 26.5412 19.8331 27.0018C19.8331 27.4626 19.4596 27.8361 18.9988 27.8361Z"
      fill="black"
    />
    <path
      d="M35 9.74895C35 6.02751 31.9724 3 28.2509 3H9.74908C6.02761 3 3 6.02751 3 9.74895V28.2511C3 31.9725 6.02761 35 9.74899 35H23.8176V30.1824H18.9995C17.2418 30.1824 15.8171 28.7576 15.8171 27.0001C15.8171 25.2426 17.2418 23.8179 18.9995 23.8179H23.8176V18.9998H9.74899C6.5911 18.9998 4.03113 16.4402 4.03113 13.2824V9.74905C4.03113 6.59127 6.5911 4.03131 9.74899 4.03131H28.2508C31.4087 4.03131 33.9686 6.59127 33.9686 9.74905V13.2824C33.9686 16.4403 31.4089 19.0001 28.251 19.0001L24.8491 18.9998V23.8179H28.2511C30.0539 23.8179 31.7487 23.1159 33.0233 21.8411C34.2977 20.5668 34.9997 18.8725 35 17.0703V9.74895Z"
      fill="black"
    />
    <path
      d="M28.251 4.03174C31.4088 4.03174 33.9687 6.59167 33.9687 9.74952V13.2828C33.9687 16.4406 31.4089 19.0005 28.2511 19.0005L9.74908 19.0003C6.59124 19.0003 4.03125 16.4406 4.03125 13.2829V9.74954C4.03125 6.59167 6.5912 4.03174 9.74908 4.03174H28.251Z"
      fill="white"
    />
    <path
      d="M28.2511 6.73267C29.611 6.73267 30.7641 7.6364 31.1394 8.87525C31.1926 9.05118 31.0527 9.22558 30.869 9.21814C28.2867 9.11348 25.877 8.32896 23.8154 7.038C23.6751 6.95014 23.739 6.73267 23.9045 6.73267H28.2511Z"
      fill={fishColor}
    />
    <path
      d="M21.9973 7.02488C24.4283 8.9081 27.4326 10.0842 30.7 10.2428C31.0172 10.2581 31.2679 10.5166 31.2679 10.8342V12.8702C31.2674 12.9124 31.2661 13.0446 31.2638 13.1857C31.2603 13.4148 31.069 13.5949 30.8401 13.5876C25.3913 13.4117 20.5215 10.9067 17.1937 7.03888C17.0905 6.91878 17.175 6.73267 17.3334 6.73267H21.1443C21.4533 6.73267 21.753 6.83569 21.9973 7.02488Z"
      fill={fishColor}
    />
    <path
      d="M15.9653 7.17305C19.4649 11.5395 24.7681 14.4013 30.735 14.6156C30.8376 14.6193 30.9004 14.7309 30.8481 14.8191C30.3219 15.7056 29.3544 16.3012 28.2505 16.3012H23.1255C22.9317 16.3012 22.7392 16.2646 22.5603 16.1899C18.0848 14.3242 14.3146 11.0926 11.7745 7.01866C11.6968 6.89417 11.7878 6.73267 11.9345 6.73267H15.0503C15.4065 6.73267 15.7426 6.89513 15.9653 7.17305Z"
      fill={fishColor}
    />
    <path
      d="M9.75058 6.73267H10.1145C10.294 6.73267 10.4589 6.82889 10.5496 6.98379C12.776 10.7844 16.0081 13.9276 19.8791 16.0439C20.0039 16.1122 19.9556 16.3012 19.8134 16.3012H15.1194C14.5651 16.3012 14.0261 16.1087 13.6043 15.7491C11.1433 13.6507 9.05479 11.1267 7.45371 8.29236C7.34983 8.10846 7.3762 7.87733 7.51835 7.72112C8.07107 7.11383 8.86658 6.73267 9.75058 6.73267Z"
      fill={fishColor}
    />
    <path
      d="M12.3071 15.9829C12.4313 16.0951 12.3514 16.3013 12.184 16.3013H9.71437C8.06547 16.2829 6.73047 14.9363 6.73047 13.2836V9.7504L6.73065 9.54576C6.73077 9.42446 6.89048 9.37962 6.95305 9.48354C8.41152 11.9061 10.2194 14.096 12.3071 15.9829Z"
      fill={fishColor}
    />
  </Icon>
);
