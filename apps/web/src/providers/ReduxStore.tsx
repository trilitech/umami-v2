import { type PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { store } from "../utils/store";

export const ReduxStore = (props: PropsWithChildren) => (
  <Provider store={store}>{props.children}</Provider>
);
