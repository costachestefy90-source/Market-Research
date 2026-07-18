"use client";

export interface PriceAlert {
  id: string;
  symbol: string;
  type: "above" | "below";
  target: number;
  createdAt: string;
  triggered: boolean;
}

const STORAGE_KEY = "price-alerts";

export function getAlerts(): PriceAlert[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveAlerts(alerts: PriceAlert[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function addAlert(alert: Omit<PriceAlert, "id" | "createdAt" | "triggered">): PriceAlert {
  const newAlert: PriceAlert = {
    ...alert,
    id: `${alert.symbol}-${alert.type}-${alert.target}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
  const alerts = getAlerts();
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

export function removeAlert(id: string) {
  const alerts = getAlerts().filter((a) => a.id !== id);
  saveAlerts(alerts);
}

export function markTriggered(id: string) {
  const alerts = getAlerts().map((a) =>
    a.id === id ? { ...a, triggered: true } : a
  );
  saveAlerts(alerts);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendNotification(title: string, body: string) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  }
}

export async function checkAlerts() {
  const alerts = getAlerts().filter((a) => !a.triggered);
  if (alerts.length === 0) return;

  const symbols = [...new Set(alerts.map((a) => a.symbol))];
  try {
    const res = await fetch(`/api/quote?symbols=${symbols.join(",")}`);
    if (!res.ok) return;
    const data = await res.json();

    for (const alert of alerts) {
      const quote = data.quotes?.[alert.symbol];
      if (!quote) continue;
      const price = quote.price;

      const hit =
        (alert.type === "above" && price >= alert.target) ||
        (alert.type === "below" && price <= alert.target);

      if (hit) {
        markTriggered(alert.id);
        sendNotification(
          `${alert.symbol} Alert`,
          `${alert.symbol} is now $${price.toFixed(2)} (${alert.type === "above" ? "above" : "below"} $${alert.target})`
        );
      }
    }
  } catch {}
}
