import React from "react";
import { Provider } from "react-redux";

import { store } from "../utils/redux/store";

export const ReduxStore = (props: { children: React.ReactElement }) => (
  <Provider store={store}>{props.children}</Provider>
);
