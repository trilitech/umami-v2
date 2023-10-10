import { IconProps } from "@chakra-ui/react";
import OutgoingArrow from "./OutgoingArrow";

const IncomingArrow: React.FC<IconProps> = props => (
  <OutgoingArrow css={{ rotate: "180deg" }} {...props} />
);
export default IncomingArrow;
