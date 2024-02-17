import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }: PropsWithChildren<object>) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
