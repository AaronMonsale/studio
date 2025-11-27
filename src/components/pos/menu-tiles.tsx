"use client";

import React from "react";
import { Button } from "@/components/ui/button";

type Item = {
  id: string;
  name: string;
  description?: string | null;
  price: any;
};

type Category = {
  id: string;
  name: string;
  items: Item[];
};

export function MenuTiles({ categories }: { categories: Category[] }) {
  const [activeId, setActiveId] = React.useState<string | null>(categories[0]?.id ?? null);
  const active = categories.find((c) => c.id === activeId) ?? null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            type="button"
            variant={cat.id === activeId ? "default" : "outline"}
            className="h-20 text-lg font-semibold"
            onClick={() => setActiveId(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {active ? (
        active.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {active.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="border rounded-md p-3 flex flex-col items-start gap-2 text-left hover:bg-accent transition-colors"
              >
                <div className="font-medium">{item.name}</div>
                {item.description ? (
                  <div className="text-xs text-muted-foreground line-clamp-2">{item.description}</div>
                ) : null}
                <div className="text-sm font-semibold">${Number(item.price).toFixed(2)}</div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No items in this category.</p>
        )
      ) : (
        <p className="text-muted-foreground">Select a category to view items.</p>
      )}
    </div>
  );
}
