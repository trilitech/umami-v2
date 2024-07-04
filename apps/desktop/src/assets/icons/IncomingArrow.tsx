import { type IconProps } from "@chakra-ui/react";

import { OutgoingArrow } from "./OutgoingArrow";

export const IncomingArrow = (props: IconProps) => (
  <OutgoingArrow css={{ rotate: "180deg" }} {...props} />
);
