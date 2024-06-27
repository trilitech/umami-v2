import { store } from "@umami/state";
import type React from "react";
import { Provider } from "react-redux";

export const ReduxStore = (props: { children: React.ReactElement }) => (
  <Provider store={store}>{props.children}</Provider>
);
