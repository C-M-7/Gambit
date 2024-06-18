import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./redux/Store.jsx";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "./redux/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <SocketProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Toaster position="bottom-center" />
          <App />
        </Provider>
      </BrowserRouter>
    </SocketProvider>
  </>
);
