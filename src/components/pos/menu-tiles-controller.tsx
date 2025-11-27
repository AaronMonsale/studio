"use client";

import React from "react";
import { MenuTiles } from "@/components/pos/menu-tiles";

type Item = { id: string; name: string; description?: string | null; price: number };

type Category = {
  id: string;
  name: string;
  items: Item[];
};

export function MenuTilesController({ categories, tableId }: { categories: Category[]; tableId: string }) {
  return (
    <MenuTiles
      categories={categories}
      onItemClick={(item) => {
        const form = document.getElementById("add-item-form") as HTMLFormElement | null;
        if (!form) return;
        const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement;
        const menuInput = form.querySelector('input[name="menuItemId"]') as HTMLInputElement;
        if (tableInput) tableInput.value = tableId;
        if (menuInput) menuInput.value = item.id;
        form.requestSubmit();
      }}
    />
  );
}
