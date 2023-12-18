import { IconProps } from "@chakra-ui/react";

import { WindowLinkIcon } from "../assets/icons/WindowLink";

export const TzktLink = ({ url, ...props }: { url: string } & IconProps) => {
  return (
    <a data-testid="tzkt-link" href={url} rel="noopener noreferrer" target="_blank">
      <WindowLinkIcon {...props} />
    </a>
  );
};
