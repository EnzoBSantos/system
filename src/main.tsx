import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Registro do Service Worker simplificado para evitar loops de refresh
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered');
      })
      .catch(error => {
        console.error('SW registration failed: ', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);