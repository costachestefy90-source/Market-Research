"use client";

import { useEffect } from "react";
import { checkAlerts } from "@/lib/alerts";

export function AlertChecker() {
  useEffect(() => {
    checkAlerts();
    const interval = setInterval(checkAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
