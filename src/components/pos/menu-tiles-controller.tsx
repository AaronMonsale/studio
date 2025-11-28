"use client";

import React from "react";
import { MenuTiles } from "@/components/pos/menu-tiles";

type Item = { id: string; name: string; description?: string | null; price: number };

type Category = {
  id: string;
  name: string;
  items: Item[];
};

type DiscountOption = {
  id: string;
  name: string;
  label: string;
};

export function MenuTilesController({
  categories,
  tableId,
  discounts,
}: {
  categories: Category[];
  tableId: string;
  discounts: DiscountOption[];
}) {
  const [selectedDiscount, setSelectedDiscount] = React.useState<string>("");

  return (
    <div className="space-y-4">
      {discounts.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Discount</span>
          <select
            className="border rounded-md h-9 px-3 text-sm max-w-xs"
            value={selectedDiscount}
            onChange={(e) => setSelectedDiscount(e.target.value)}
          >
            <option value="">No discount</option>
            {discounts.map((d) => (
              <option key={d.id} value={d.name}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <MenuTiles
        categories={categories}
        onItemClick={(item) => {
          const form = document.getElementById("add-item-form") as HTMLFormElement | null;
          if (!form) return;
          const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement;
          const menuInput = form.querySelector('input[name="menuItemId"]') as HTMLInputElement;
          const discountInput = form.querySelector('input[name="discountName"]') as HTMLInputElement | null;
          if (tableInput) tableInput.value = tableId;
          if (menuInput) menuInput.value = item.id;
          if (discountInput) discountInput.value = selectedDiscount;
          form.requestSubmit();
        }}
      />
    </div>
  );
}
