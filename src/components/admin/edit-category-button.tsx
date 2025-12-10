'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EditCategoryButton({ categoryId, name }: { categoryId: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(name);
  const router = useRouter();

  return (
    <div className="inline-flex items-center gap-2">
      {!open ? (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      ) : (
        <form
          action={async (formData) => {
            const { updateCategory } = await import('@/lib/admin-actions');
            await updateCategory(formData);
            setOpen(false);
            router.refresh();
          }}
          className="flex items-center gap-2"
        >
          <input type="hidden" name="categoryId" value={categoryId} />
          <Label htmlFor={`edit-cat-${categoryId}`} className="sr-only">Name</Label>
          <Input id={`edit-cat-${categoryId}`} name="name" value={value} onChange={(e) => setValue(e.target.value)} className="h-8 w-40" />
          <Button type="submit" size="sm">Save</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setValue(name); setOpen(false); }}>Cancel</Button>
        </form>
      )}
    </div>
  );
}
