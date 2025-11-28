'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function EditMenuItemButton({ item }: { item: { id: string; name: string; price: number | string; description: string | null } }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(String(item.price));
  const [description, setDescription] = useState(item.description ?? '');
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-2">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      ) : (
        <form
          action={async (formData) => {
            const { updateMenuItem } = await import('@/lib/admin-actions');
            await updateMenuItem(formData);
            setOpen(false);
            router.refresh();
          }}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="itemId" value={item.id} />
          <Label htmlFor={`edit-item-name-${item.id}`} className="sr-only">Name</Label>
          <Input id={`edit-item-name-${item.id}`} name="name" value={name} onChange={(e) => setName(e.target.value)} className="h-8 w-40" />
          <Label htmlFor={`edit-item-price-${item.id}`} className="sr-only">Price</Label>
          <Input id={`edit-item-price-${item.id}`} name="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="h-8 w-28" />
          <Label htmlFor={`edit-item-desc-${item.id}`} className="sr-only">Description</Label>
          <Textarea id={`edit-item-desc-${item.id}`} name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="h-8 w-56" />
          <Button type="submit" size="sm">Save</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setName(item.name); setPrice(String(item.price)); setDescription(item.description ?? ''); setOpen(false); }}>Cancel</Button>
        </form>
      )}
    </div>
  );
}
