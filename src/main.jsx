import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ServerStatusProvider } from "./context/ServerStatusContext.jsx";
import { SYSTEM_INFORMATION } from "./config/constants";

// Set the page title using SYSTEM_INFORMATION
document.title = SYSTEM_INFORMATION.title;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ServerStatusProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ServerStatusProvider>
  </React.StrictMode>
);
