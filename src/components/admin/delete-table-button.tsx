'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function DeleteTableButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <form
      action={async (formData) => {
        const { deleteTable } = await import('@/lib/admin-actions');
        await deleteTable(formData);
        router.refresh();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        onClick={(e) => {
          if (!confirm('Delete this table? Any linked orders will be detached.')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </Button>
    </form>
  );
}
