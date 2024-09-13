import { Card, Divider } from "@chakra-ui/react";
import { Fragment } from "react";

/**
 * Types
 */
interface IProps {
  chains: string[];
  protocol: string;
}

/**
 * Component
 */
export default function RequestDetailsCard({ chains, protocol }: IProps) {
  return (
    <Fragment>
      <div>
        <div>
          <Card className="text-xl font-semibold">Blockchain(s)</Card>
          <div data-testid="request-details-chain" style={{ color: "gray" }}>
            {chains.join(", ")}
          </div>
        </div>
      </div>

      <Divider />

      <div>
        <div>
          <Card className="text-xl font-semibold">Relay Protocol</Card>
          <div data-testid="request-detauls-realy-protocol" style={{ color: "gray" }}>
            {protocol}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
