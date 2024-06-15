import { type IconProps } from "@chakra-ui/react";

import { OutgoingArrow } from "./OutgoingArrow";

export const IncomingArrow: React.FC<IconProps> = props => (
  <OutgoingArrow css={{ rotate: "180deg" }} {...props} />
);
