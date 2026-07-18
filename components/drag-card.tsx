"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

interface DragCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
}

export function DragCard({ title, description, children, headerExtra }: DragCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="drag-handle flex-row items-center gap-2 space-y-0 pb-2">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {headerExtra}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {children}
      </CardContent>
    </Card>
  );
}
