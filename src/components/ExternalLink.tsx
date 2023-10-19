import { Link, LinkProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export const ExternalLink: React.FC<PropsWithChildren<{ href: string } & LinkProps>> = ({
  href,
  children,
  ...props
}) => (
  <Link
    href={href}
    role="link"
    display="flex"
    target="_blank"
    rel="noreferrer"
    alignItems="center"
    _hover={{ textDecoration: "none" }}
    {...props}
  >
    {children}
  </Link>
);
