declare module "*.svg" {
  import { type ComponentProps, type FunctionComponent } from "react";

  const ReactComponent: FunctionComponent<ComponentProps<"svg"> & { title?: string }>;

  export default ReactComponent;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}
