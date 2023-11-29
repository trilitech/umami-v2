import { Provider } from "react-redux";
import { AnyAction, Store } from "redux";

export const getWrapper = (store: Store<any, AnyAction>): React.FC => {
  return ({ children }: { children?: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};
