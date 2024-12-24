import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as UseFetchProvider } from "use-http";
import App from "./App";
import { persistor, store } from "./redux/store";
import "./i18n";
import useFetchOptions from "./hooks/use-fetch-options";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const BACK_API = `${process.env.REACT_APP_BACK_API || ""}/api`;

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <UseFetchProvider url={BACK_API} options={useFetchOptions()}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PersistGate>
      </UseFetchProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
