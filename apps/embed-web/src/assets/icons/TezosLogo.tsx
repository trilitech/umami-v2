import { Icon, type IconProps } from "@chakra-ui/react";

import colors from "../../imported/style/colors";

export const TezosLogoIcon = (props: IconProps) => (
  <Icon
    width="87px"
    height="30px"
    fill="none"
    viewBox="0 0 87 30"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M43.1417 6.75202H37.8086V21.159H36.499V6.75202H31.1793V5.6469H43.1417V6.75202ZM48.0698 21.3881C47.0842 21.3881 46.1931 21.1456 45.41 20.6604C44.6269 20.1752 43.9923 19.5013 43.5603 18.6388C43.1147 17.7763 42.8987 16.8059 42.8987 15.7412V15.283C42.8987 14.1779 43.1147 13.1806 43.5468 12.2911C43.9788 11.4016 44.5729 10.7008 45.3425 10.2022C46.1121 9.7035 46.9492 9.43396 47.8403 9.43396C49.2445 9.43396 50.3516 9.90566 51.1752 10.8625C51.9988 11.8194 52.4038 13.1267 52.4038 14.7844V15.4987H44.1544V15.7412C44.1544 17.0485 44.5324 18.1402 45.275 19.0027C46.0311 19.8787 46.9762 20.31 48.1103 20.31C48.7989 20.31 49.393 20.1887 49.9195 19.9326C50.4461 19.69 50.9187 19.2857 51.3507 18.7332L52.1473 19.3396C51.2292 20.7008 49.8655 21.3881 48.0698 21.3881ZM47.8403 10.5121C46.8817 10.5121 46.0716 10.8625 45.41 11.5633C44.7484 12.2642 44.3569 13.2075 44.2084 14.3935H51.1347V14.2588C51.0942 13.1536 50.7836 12.2507 50.1896 11.5499C49.5955 10.8491 48.8124 10.5121 47.8403 10.5121ZM56.1843 20.0943H63.6912V21.1725H54.6046V20.2291L61.6119 10.7412H54.8206V9.63612H63.2186V10.593L56.1843 20.0943ZM65.5274 15.2291C65.5274 14.124 65.7434 13.1267 66.1755 12.2372C66.6075 11.3477 67.2151 10.6604 67.9982 10.1617C68.7813 9.66307 69.6724 9.42049 70.6715 9.42049C72.2107 9.42049 73.4528 9.95957 74.4114 11.0377C75.37 12.1159 75.8426 13.5445 75.8426 15.3235V15.593C75.8426 16.7116 75.6266 17.7089 75.1945 18.5984C74.7625 19.4879 74.1549 20.1752 73.3718 20.6604C72.5887 21.1456 71.6976 21.3881 70.6985 21.3881C69.1728 21.3881 67.9172 20.8491 66.9586 19.7709C65.9999 18.6927 65.5274 17.2642 65.5274 15.4852V15.2291ZM66.81 15.5795C66.81 16.9542 67.1746 18.0863 67.8767 18.9757C68.5922 19.8652 69.5239 20.2965 70.685 20.2965C71.8326 20.2965 72.7777 19.8518 73.4933 18.9757C74.2089 18.0863 74.56 16.9272 74.56 15.4717V15.2291C74.56 14.3531 74.3979 13.5445 74.0739 12.8032C73.7499 12.0755 73.2908 11.5094 72.6967 11.1051C72.1027 10.7008 71.4276 10.4987 70.6715 10.4987C69.5374 10.4987 68.6058 10.9434 67.8767 11.8329C67.1611 12.7224 66.7965 13.8949 66.7965 15.3369L66.81 15.5795ZM85.4017 18.2345C85.4017 17.6011 85.1452 17.0889 84.6321 16.7116C84.1191 16.3342 83.363 16.0243 82.3234 15.8086C81.2837 15.593 80.5006 15.3369 79.9336 15.0674C79.3665 14.7844 78.948 14.4474 78.6779 14.0431C78.4079 13.6388 78.2594 13.1536 78.2594 12.5741C78.2594 11.6577 78.6374 10.9164 79.407 10.3235C80.1631 9.73046 81.1487 9.43396 82.3369 9.43396C83.6195 9.43396 84.6591 9.75741 85.4422 10.3908C86.2253 11.0243 86.6169 11.8598 86.6169 12.8841H85.3342C85.3342 12.2102 85.0507 11.6442 84.4836 11.1995C83.9166 10.7547 83.201 10.5256 82.3369 10.5256C81.4998 10.5256 80.8247 10.7143 80.3116 11.0782C79.7986 11.4555 79.542 11.9407 79.542 12.5337C79.542 13.1132 79.7581 13.558 80.1766 13.8679C80.5952 14.1779 81.3783 14.4744 82.4989 14.7439C83.6195 15.0135 84.4566 15.283 85.0237 15.5795C85.5773 15.876 85.9958 16.2399 86.2658 16.6577C86.5359 17.0755 86.6709 17.5876 86.6709 18.1806C86.6709 19.1509 86.2793 19.9326 85.4962 20.5121C84.7131 21.0916 83.687 21.3881 82.4179 21.3881C81.0677 21.3881 79.9741 21.0647 79.1505 20.4178C78.3134 19.7709 77.8948 18.9488 77.8948 17.9515H79.1775C79.2315 18.6927 79.542 19.2722 80.1226 19.69C80.7032 20.1078 81.4728 20.31 82.4314 20.31C83.3225 20.31 84.0381 20.1078 84.5916 19.7305C85.1317 19.3261 85.4017 18.8275 85.4017 18.2345ZM21.7417 22.035C21.4312 16.5499 14.5184 14.0566 13.8568 13.8005C13.8298 13.7871 13.8298 13.7601 13.8433 13.7332L20.9721 6.5903V5.8221C20.9721 5.70081 20.8641 5.59299 20.7426 5.59299H7.60555V0L2.75847 1.01078V1.73854H3.0285C3.0285 1.73854 4.21665 1.73854 4.21665 2.92453V5.57951H0.463202C0.395694 5.57951 0.328186 5.6469 0.328186 5.71429V7.39892H4.23015V16.5499C4.23015 19.4205 6.07987 21.4151 9.32025 21.1456C10.0088 21.0916 10.6434 20.8221 11.1835 20.4717C11.4265 20.31 11.575 20.0539 11.575 19.7574V18.8544C10.5219 19.5553 9.63078 19.5148 9.63078 19.5148C7.57854 19.5148 7.61905 16.9137 7.61905 16.9137V7.39892H17.0702L10.2654 14.2453C10.2519 15.1482 10.2384 15.8491 10.2384 15.8625C10.2384 15.8895 10.2519 15.903 10.2789 15.903C16.5166 16.9542 18.2043 20.9838 18.2043 22.1563C18.2043 22.1563 18.8794 27.8571 13.1682 28.248C13.1682 28.248 9.42826 28.4097 8.76668 26.9137C8.73968 26.8598 8.76668 26.8059 8.82069 26.779C9.44176 26.496 9.86031 25.9434 9.86031 25.2022C9.86031 24.097 9.18523 23.1941 7.76756 23.1941C6.61993 23.1941 5.67482 24.097 5.67482 25.2022C5.67482 25.2022 5.13475 30 13.1547 29.8652C22.3088 29.7035 21.7417 22.035 21.7417 22.035Z"
      fill={colors.gray[450]}
    />
  </Icon>
);
