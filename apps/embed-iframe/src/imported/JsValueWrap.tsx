import { Card, CardBody, type CardProps } from "@chakra-ui/react";

import colors from "./style/colors";

// Wrapper for any JavaScript value
export const JsValueWrap = ({
  value,
  space = 2,
  ...props
}: { value: any; space?: number } & CardProps) => (
  <Card background={colors.grey[100]} borderRadius="5px" {...props}>
    <CardBody>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "12px",
          lineHeight: "18px",
        }}
      >
        {JSON.stringify(value, null, space)}
      </pre>
    </CardBody>
  </Card>
);
