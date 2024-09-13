import { Card, CardBody } from "@chakra-ui/react";
import { type ReactNode } from "react";

interface Props {
  children: ReactNode | ReactNode[];
  rgb: string;
  flexDirection: "row" | "col";
  alignItems: "center" | "flex-start";
  flexWrap?: "wrap" | "nowrap";
}

export default function ChainCard({ rgb, children, flexDirection, alignItems, flexWrap }: Props) {
  return (
    <Card
      className="mb-6 min-h-[70px] shadow-md rounded-lg border"
      style={{
        borderColor: `rgba(${rgb}, 0.4)`,
        boxShadow: `0 0 10px 0 rgba(${rgb}, 0.15)`,
        backgroundColor: `rgba(${rgb}, 0.25)`,
      }}
    >
      <CardBody
        className={`flex justify-between overflow-hidden
          ${flexWrap === "wrap" ? "flex-wrap" : "flex-nowrap"}
          ${flexDirection === "row" ? "flex-row" : "flex-col"}
          ${alignItems === "center" ? "items-center" : "items-start"}
        `}
      >
        {children}
      </CardBody>
    </Card>
  );
}
