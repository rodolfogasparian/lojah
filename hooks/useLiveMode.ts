"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "admin-live-mode";

export function useLiveMode() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  function toggle() {
    setLive((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return { live, toggle };
}
