import { Card, CardBody, CardProps } from "@chakra-ui/react";

import colors from "../../style/colors";

// Wrapper for any JavaScript value
export const JsValueWrap: React.FC<{ value: any; space?: number } & CardProps> = ({
  value,
  space = 2,
  ...props
}) => (
  <Card background={colors.gray[700]} borderRadius="5px" {...props}>
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
