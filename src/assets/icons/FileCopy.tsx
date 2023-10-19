import { Icon, IconProps } from "@chakra-ui/react";
import colors from "../../style/colors";
import { useState } from "react";

const FileCopyIcon: React.FC<IconProps> = props => {
  const [mouseHover, setMouseHover] = useState(false);
  return (
    <Icon
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      {...props}
    >
      <path
        d="M11.25 2.25V4.8C11.25 5.22004 11.25 5.43006 11.3317 5.59049C11.4037 5.73161 11.5184 5.84635 11.6595 5.91825C11.8199 6 12.03 6 12.45 6H15M7.5 6H4.5C3.67157 6 3 6.67157 3 7.5V14.25C3 15.0784 3.67157 15.75 4.5 15.75H9C9.82843 15.75 10.5 15.0784 10.5 14.25V12M12 2.25H9.9C9.05992 2.25 8.63988 2.25 8.31901 2.41349C8.03677 2.5573 7.8073 2.78677 7.66349 3.06901C7.5 3.38988 7.5 3.80992 7.5 4.65V9.6C7.5 10.4401 7.5 10.8601 7.66349 11.181C7.8073 11.4632 8.03677 11.6927 8.31901 11.8365C8.63988 12 9.05992 12 9.9 12H12.6C13.4401 12 13.8601 12 14.181 11.8365C14.4632 11.6927 14.6927 11.4632 14.8365 11.181C15 10.8601 15 10.4401 15 9.6V5.25L12 2.25Z"
        stroke={mouseHover ? colors.gray[300] : colors.gray[450]}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Icon>
  );
};

export default FileCopyIcon;
