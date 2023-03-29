import { Icon, IconProps } from "@chakra-ui/react";
import { TfiNewWindow } from "react-icons/tfi";

export const TzktLink = ({ url, ...props }: { url: string } & IconProps) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <Icon as={TfiNewWindow} {...props} />
    </a>
  );
};
