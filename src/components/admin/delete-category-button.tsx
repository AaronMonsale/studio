'use client';

import { Button } from '@/components/ui/button';
import React from 'react';

export function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  return (
    <form
      action={async (formData) => {
        const { deleteCategory } = await import('@/lib/admin-actions');
        await deleteCategory(formData);
      }}
      className="inline"
    >
      <input type="hidden" name="categoryId" value={categoryId} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          if (!confirm('Delete this category and all its items? This cannot be undone.')) {
            e.preventDefault();
          }
        }}
      >
        Delete Category
      </Button>
    </form>
  );
}
