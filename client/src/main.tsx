import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add smooth scrolling behavior
document.addEventListener("DOMContentLoaded", () => {
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a[href^="#"]');

    if (anchor) {
      e.preventDefault();
      
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId || '');
      if (targetElement) {
        window.scrollTo({
          top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  document.body.addEventListener('click', handleAnchorClick);
});

createRoot(document.getElementById("root")!).render(<App />);
