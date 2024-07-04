import { Link, type LinkProps } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

export const ExternalLink = ({
  href,
  children,
  ...props
}: PropsWithChildren<{ href: string } & LinkProps>) => (
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
