import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { router } from "./Router";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import { store } from "./utils/store/store";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <App /> */}

    <ChakraProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
