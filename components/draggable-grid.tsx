"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  ResponsiveGridLayout,
  verticalCompactor,
  type LayoutItem,
  type Layout,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export interface GridItem {
  id: string;
  content: React.ReactNode;
  defaultW?: number;
  defaultH?: number;
  minW?: number;
  minH?: number;
}

interface DraggableGridProps {
  items: GridItem[];
  storageKey: string;
  cols?: number;
  rowHeight?: number;
}

function buildDefaultLayout(items: GridItem[], cols: number): LayoutItem[] {
  let x = 0;
  let y = 0;
  return items.map((item) => {
    const w = item.defaultW ?? 6;
    const h = item.defaultH ?? 4;
    if (x + w > cols) { x = 0; y += h; }
    const li: LayoutItem = { i: item.id, x, y, w, h, minW: item.minW ?? 3, minH: item.minH ?? 3 };
    x += w;
    return li;
  });
}

export function DraggableGrid({
  items,
  storageKey,
  cols = 12,
  rowHeight = 80,
}: DraggableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    obs.observe(containerRef.current);
    setWidth(containerRef.current.offsetWidth);
    return () => obs.disconnect();
  }, []);

  const [layouts, setLayouts] = useState<{ lg: LayoutItem[] }>(() => {
    if (typeof window === "undefined") return { lg: buildDefaultLayout(items, 2) };
    const saved = localStorage.getItem(`grid-layout-${storageKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedIds = new Set(parsed.lg?.map((l: LayoutItem) => l.i));
        const allPresent = items.every((item) => savedIds.has(item.id));
        if (allPresent) return parsed;
      } catch {}
    }
    return { lg: buildDefaultLayout(items, cols) };
  });

  const onLayoutChange = useCallback(
    (_current: Layout, allLayouts: Partial<Record<string, Layout>>) => {
      setLayouts(allLayouts as { lg: LayoutItem[] });
      localStorage.setItem(`grid-layout-${storageKey}`, JSON.stringify(allLayouts));
    },
    [storageKey]
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || width === 0) return <div ref={containerRef} className="w-full min-h-[100px]" />;

  return (
    <div ref={containerRef} className="w-full">
      <ResponsiveGridLayout
        className="draggable-grid"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: cols, md: cols, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={rowHeight}
        width={width}
        onLayoutChange={onLayoutChange}
        dragConfig={{ enabled: true, handle: ".drag-handle" }}
        compactor={verticalCompactor}
        margin={[16, 16]}
      >
        {items.map((item) => (
          <div key={item.id} className="grid-item">
            {item.content}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}
