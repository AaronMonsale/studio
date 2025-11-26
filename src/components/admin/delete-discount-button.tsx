'use client';

import { Button } from '@/components/ui/button';

export function DeleteDiscountButton({ id }: { id: string }) {
  return (
    <form
      action={async (formData) => {
        const { deleteDiscount } = await import('@/lib/admin-actions');
        await deleteDiscount(formData);
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          if (!confirm('Delete this discount? This action cannot be undone.')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </Button>
    </form>
  );
}
