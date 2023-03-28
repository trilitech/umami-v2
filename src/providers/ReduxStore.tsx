import React from "react";
import { Provider } from "react-redux";
import { store } from "../utils/store/store";

export const ReduxStore = (props: { children: React.ReactElement }) => {
  return <Provider store={store}>{props.children}</Provider>;
};
