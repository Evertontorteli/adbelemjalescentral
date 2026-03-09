import { createRoot } from "react-dom/client";
import Typebot from "@typebot.io/js/dist/web.js";
import App from "./App.jsx";
import "./index.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")).render(<App />);

Typebot.initBubble({
  typebot: "chatadbelemjales",
  previewMessage: {
    message: "👋 Olá! Seja bem-vindo(a). Posso te ajudar?",
    autoShowDelay: 10000,
    avatarUrl:
      "https://s3.typebot.io/public/workspaces/clqzc3xhx0048l80fydh10lss/typebots/clqzc8gg3004qjj0ibh0oqxwc/hostAvatar?v=1773067712392",
  },
  theme: {
    button: {
      backgroundColor: "#4A8BB2",
      customIconSrc:
        "https://s3.typebot.io/public/workspaces/clqzc3xhx0048l80fydh10lss/typebots/clqzc8gg3004qjj0ibh0oqxwc/bubble-icon?v=1773087105827",
    },
    chatWindow: {
      backgroundColor: "#ffffff",
    },
  },
});

// No mobile, sobe o globo do Typebot para ficar acima da barra de navegação (estilo está no Shadow DOM)
function applyTypebotBubbleOffset() {
  const bubble = document.querySelector("typebot-bubble");
  if (!bubble?.shadowRoot) return;
  const id = "typebot-bubble-mobile-offset";
  if (bubble.shadowRoot.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @media (max-width: 1023px) {
      [style*="--container-bottom"] {
        --container-bottom: 88px !important;
      }
    }
  `;
  bubble.shadowRoot.appendChild(style);
}
// Aplica assim que o elemento existir (Typebot monta de forma assíncrona)
const observer = new MutationObserver(() => {
  applyTypebotBubbleOffset();
});
observer.observe(document.body, { childList: true, subtree: true });
// Tenta aplicar de imediato e após um pequeno delay
applyTypebotBubbleOffset();
setTimeout(applyTypebotBubbleOffset, 1500);
