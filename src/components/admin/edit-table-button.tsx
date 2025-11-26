'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EditTableButton({ table }: { table: { id: string; label: string; capacity: number; status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' } }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(table.label);
  

  return (
    <div className="inline-flex items-center gap-2">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      ) : (
        <form
          action={async (formData) => {
            const { updateTable } = await import('@/lib/admin-actions');
            await updateTable(formData);
            setOpen(false);
          }}
          className="flex flex-col gap-2 p-2 border rounded-md w-full"
        >
          <input type="hidden" name="id" value={table.id} />
          <div className="flex items-center gap-2">
            <Label htmlFor={`tbl-label-${table.id}`} className="sr-only">Label</Label>
            <Input id={`tbl-label-${table.id}`} name="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="h-8" />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setLabel(table.label); setOpen(false); }}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
