"use client";

import { useEffect } from "react";

/**
 * Loads FontAwesome Pro CSS asynchronously after first paint.
 * Prevents the 76 KB stylesheet from blocking initial render.
 */
export function FontAwesomeLoader() {
  useEffect(() => {
    const href = "/app/css/fontawesome-pro.css";
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);

  return null;
}
