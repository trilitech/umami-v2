import { Code } from "@chakra-ui/react";

/**
 * Types
 */
interface IProps {
  data: Record<string, unknown>;
}

/**
 * Component
 */
export default function RequestDataCard({ data }: IProps) {
  return (
    <div>
      <div>
        <h5>Data</h5>
        <Code color="primary">{JSON.stringify(data, null, 2)}</Code>
      </div>
    </div>
  );
}
