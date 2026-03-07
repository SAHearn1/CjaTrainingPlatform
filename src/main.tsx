
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { initMonitoring } from "./app/monitoring";

  initMonitoring();

  createRoot(document.getElementById("root")!).render(<App />);
  