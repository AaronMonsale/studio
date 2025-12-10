"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Ban, CircleDollarSign, Hand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PosActions({ tableId, hasOpenOrder }: { tableId: string; hasOpenOrder: boolean }) {
  const [reserveOpen, setReserveOpen] = React.useState(false);
  const [reserveName, setReserveName] = React.useState("");

  function submitReservation() {
    const name = reserveName.trim();
    if (!name) return;
    const form = document.getElementById("reserve-table-form") as HTMLFormElement | null;
    if (!form) return;
    const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement | null;
    const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement | null;
    if (tableInput) tableInput.value = tableId;
    if (nameInput) nameInput.value = name;
    form.requestSubmit();
    setReserveOpen(false);
  }

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {/* Occupied */}
      <Button
        variant="outline"
        disabled={!hasOpenOrder}
        aria-disabled={!hasOpenOrder}
        onClick={() => {
          if (!hasOpenOrder) return;
          if (!window.confirm("Mark this table as occupied and send the order to the kitchen?")) {
            return;
          }
          const form = document.getElementById("mark-occupied-form") as HTMLFormElement | null;
          if (!form) return;
          const tableInput = form.querySelector('input[name="tableId"]') as HTMLInputElement | null;
          if (tableInput) tableInput.value = tableId;
          form.requestSubmit();
        }}
      >
        <Hand className="mr-2" />Occupied
      </Button>

      {/* Reserved (dialog for name) */}
      <Dialog open={reserveOpen} onOpenChange={setReserveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Reserved</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reserve table</DialogTitle>
            <DialogDescription>
              Enter the guest name for this reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-2">
            <Label htmlFor="reservation-name">Reservation name</Label>
            <Input
              id="reservation-name"
              value={reserveName}
              onChange={(e) => setReserveName(e.target.value)}
              placeholder="e.g., John Smith"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setReserveOpen(false);
                setReserveName("");
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={submitReservation}>
              Save reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full width cancel below in server layout */}
    </div>
  );
}
