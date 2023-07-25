import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Router from "./Router";

import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "./utils/redux/store";

import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ReduxStore } from "./providers/ReduxStore";
import { UmamiTheme } from "./providers/UmamiTheme";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <UmamiTheme>
      <ReduxStore>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <ReactQueryProvider>
            <Router />
          </ReactQueryProvider>
        </PersistGate>
      </ReduxStore>
    </UmamiTheme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
