import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./ui-extra.css";

declare global {
  interface Window {
    Clerk?: any;
  }
}

function route() {
  return window.location.pathname.replace(/\/$/, "") || "/";
}

function App() {
  return <div />;
}

createRoot(document.getElementById("root")!).render(<App />);
