"use client";

import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLang(lang === "en" ? "ro" : "en")}
      title={lang === "en" ? "Română" : "English"}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">{lang === "en" ? "Română" : "English"}</span>
    </Button>
  );
}
