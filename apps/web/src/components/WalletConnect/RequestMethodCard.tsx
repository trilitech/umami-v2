import { Card } from "@chakra-ui/react";

/**
 * Types
 */
interface IProps {
  methods: string[];
}

/**
 * Component
 */
export default function RequestMethodCard({ methods }: IProps) {
  return (
    <div>
      <div>
        <h5>Methods</h5>
        <Card data-testid="request-methods">{methods.map(method => method).join(", ")}</Card>
      </div>
    </div>
  );
}
