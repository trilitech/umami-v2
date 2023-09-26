import { IconProps } from "@chakra-ui/react";
import OutgoingArrow from "./OutgoingArrow";

const IncomingArrow: React.FC<IconProps> = props => <OutgoingArrow {...props} rotate="180" />;
export default IncomingArrow;
