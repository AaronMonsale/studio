'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

export function DeleteMenuItemButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  return (
    <form
      action={async (formData) => {
        const { deleteMenuItem } = await import('@/lib/admin-actions');
        await deleteMenuItem(formData);
        router.refresh();
      }}
      className="inline"
    >
      <input type="hidden" name="itemId" value={itemId} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          if (!confirm('Delete this item? This action cannot be undone.')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </Button>
    </form>
  );
}
