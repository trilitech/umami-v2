import { Link, type LinkProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const ExternalLink: React.FC<PropsWithChildren<{ href: string } & LinkProps>> = ({
  href,
  children,
  ...props
}) => (
  <Link
    alignItems="center"
    display="flex"
    _hover={{ textDecoration: "none" }}
    href={href}
    rel="noopener noreferrer"
    role="link"
    target="_blank"
    {...props}
  >
    {children}
  </Link>
);
