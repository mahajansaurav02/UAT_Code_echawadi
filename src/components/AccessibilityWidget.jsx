import { useEffect } from "react";

const AccessibilityWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.userway.org/widget.js";
    script.setAttribute("data-account", "gtwMEnfvIr");
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return null;
};

export default AccessibilityWidget;