"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Ban, CircleDollarSign, Hand } from "lucide-react";

export function PosActions({ tableId, hasOpenOrder }: { tableId: string; hasOpenOrder: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {/* Occupied */}
      <Button
        variant="outline"
        disabled={!hasOpenOrder}
        aria-disabled={!hasOpenOrder}
        onClick={() => {
          if (!hasOpenOrder) return;
          const form = document.getElementById("mark-occupied-form") as HTMLFormElement | null;
          if (!form) return;
          const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement | null;
          if (tableInput) tableInput.value = tableId;
          form.requestSubmit();
        }}
      >
        <Hand className="mr-2" />Occupied
      </Button>

      {/* Reserved (prompt name) */}
      <Button
        variant="outline"
        onClick={() => {
          const name = typeof window !== "undefined" ? window.prompt("Reservation name") || "" : "";
          if (!name) return;
          const form = document.getElementById("reserve-table-form") as HTMLFormElement | null;
          if (!form) return;
          const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement | null;
          const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement | null;
          if (tableInput) tableInput.value = tableId;
          if (nameInput) nameInput.value = name;
          form.requestSubmit();
        }}
      >
        Reserved
      </Button>

      {/* Full width cancel below in server layout */}
    </div>
  );
}
