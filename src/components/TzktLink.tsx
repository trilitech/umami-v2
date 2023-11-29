import { Icon, IconProps } from "@chakra-ui/react";
import { TfiNewWindow } from "react-icons/tfi";

export const TzktLink = ({ url, ...props }: { url: string } & IconProps) => {
  return (
    <a data-testid="tzkt-link" href={url} rel="noopener noreferrer" target="_blank">
      <Icon as={TfiNewWindow} {...props} />
    </a>
  );
};
