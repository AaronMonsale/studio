'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

export function DeleteUserButton({ userId }: { userId: string }) {
  return (
    <form action={async (formData) => {
      const { deleteUser } = await import('@/lib/admin-actions');
      await deleteUser(formData);
    }} className="inline">
      <input type="hidden" name="userId" value={userId} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          if (!confirm('Delete this user? This action cannot be undone.')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </Button>
    </form>
  );
}
