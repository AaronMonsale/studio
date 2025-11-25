'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDiscount } from '@/lib/admin-actions';

type Category = {
  id: string;
  name: string;
  items: { id: string; name: string }[];
};

export function DiscountForm({ categories }: { categories: Category[] }) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const items = useMemo(
    () => categories.find((c) => c.id === categoryId)?.items ?? [],
    [categories, categoryId]
  );

  return (
    <form action={createDiscount} className="grid gap-4 max-w-2xl">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input id="name" name="name" placeholder="e.g., Lunch Promo" className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">Type</Label>
        <select id="type" name="type" className="col-span-3 border rounded-md h-9 px-3">
          <option value="FIXED">Fixed amount</option>
          <option value="PERCENT">Percentage</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="value" className="text-right">Value</Label>
        <Input id="value" name="value" type="number" step="0.01" placeholder="e.g., 5 or 10" className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="categoryId" className="text-right">Category</Label>
        <select
          id="categoryId"
          name="categoryId"
          className="col-span-3 border rounded-md h-9 px-3"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">Apply to items</div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <label key={it.id} className="flex items-center gap-2 border rounded-md p-2">
              <input type="checkbox" name="itemIds" value={it.id} className="h-4 w-4" />
              <span>{it.name}</span>
            </label>
          ))}
          {items.length === 0 && (
            <div className="text-sm text-muted-foreground">No items in this category.</div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Create Discount</Button>
      </div>
    </form>
  );
}
