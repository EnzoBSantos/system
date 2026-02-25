import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Registro do Service Worker com detecção de atualização
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
        
        // Detecta se há uma nova versão esperando
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão pronta! Força o reload para o usuário ver o app novo
                console.log('New content available, refreshing...');
                window.location.reload();
              }
            };
          }
        };
      })
      .catch(error => {
        console.error('SW registration failed: ', error);
      });
  });

  // Escuta quando o novo SW assume o controle
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);