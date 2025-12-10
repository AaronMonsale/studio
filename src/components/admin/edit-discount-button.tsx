'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Discount = {
  id: string;
  name: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  categoryId: string;
  startsAt?: string | null;
  endsAt?: string | null;
  active?: boolean;
};

export function EditDiscountButton({ discount, categories }: { discount: Discount; categories: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(discount.name);
  const [type, setType] = useState<Discount['type']>(discount.type);
  const [value, setValue] = useState(String(discount.value));
  const [categoryId, setCategoryId] = useState(discount.categoryId);
  const [startsAt, setStartsAt] = useState(discount.startsAt ? new Date(discount.startsAt).toISOString().slice(0,16) : '');
  const [endsAt, setEndsAt] = useState(discount.endsAt ? new Date(discount.endsAt).toISOString().slice(0,16) : '');
  const [active, setActive] = useState(Boolean(discount.active));
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-2">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      ) : (
        <form
          action={async (formData) => {
            const { updateDiscount } = await import('@/lib/admin-actions');
            await updateDiscount(formData);
            setOpen(false);
            router.refresh();
          }}
          className="grid gap-2 p-2 border rounded-md"
        >
          <input type="hidden" name="id" value={discount.id} />
          <div className="flex items-center gap-2">
            <Label htmlFor={`disc-name-${discount.id}`} className="sr-only">Name</Label>
            <Input id={`disc-name-${discount.id}`} name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-8 w-40" />
            <select name="type" value={type} onChange={(e) => setType(e.target.value as any)} className="h-8 border rounded px-2">
              <option value="PERCENT">Percent</option>
              <option value="FIXED">Fixed</option>
            </select>
            <Label htmlFor={`disc-value-${discount.id}`} className="sr-only">Value</Label>
            <Input id={`disc-value-${discount.id}`} name="value" type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="h-8 w-24" />
            <select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="h-8 border rounded px-2">
              {categories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`disc-start-${discount.id}`} className="sr-only">Starts</Label>
            <Input id={`disc-start-${discount.id}`} name="startsAt" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="h-8" />
            <Label htmlFor={`disc-end-${discount.id}`} className="sr-only">Ends</Label>
            <Input id={`disc-end-${discount.id}`} name="endsAt" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="h-8" />
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" name="active" checked={active} onChange={(e) => setActive(e.target.checked)} /> Active
            </label>
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); }}>Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}
