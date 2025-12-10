import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listMenu, listDiscounts } from "@/lib/admin-actions";
import { DiscountForm } from "@/components/admin/discount-form";
import { EditDiscountButton } from "@/components/admin/edit-discount-button";
import { DeleteDiscountButton } from "@/components/admin/delete-discount-button";

export default async function DiscountsPage() {
  // Fetch categories with their items for selection, and existing discounts for listing
  const [categories, discounts] = await Promise.all([
    listMenu(),
    listDiscounts(),
  ]);

  const simpleCategories = categories.map((c: { id: string; name: string; items: { id: string; name: string }[] }) => ({
    id: c.id,
    name: c.name,
    items: c.items.map((it: { id: string; name: string }) => ({ id: it.id, name: it.name })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Discounts</h1>
        <p className="text-muted-foreground">Create discounts by fixed amount or percentage and apply them to specific categories and items.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Discount</CardTitle>
          <CardDescription>Define discount type, value, category and the applicable items.</CardDescription>
        </CardHeader>
        <CardContent>
          <DiscountForm categories={simpleCategories} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Discounts</CardTitle>
          <CardDescription>Overview of discounts configured in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Value</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Starts</th>
                  <th className="py-2 pr-4">Ends</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((d: any) => (
                  <tr key={d.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{d.name}</td>
                    <td className="py-2 pr-4">{d.type === 'PERCENT' ? 'Percentage' : 'Fixed'}</td>
                    <td className="py-2 pr-4">{d.type === 'PERCENT' ? `${Number(d.value)}%` : `$${Number(d.value).toFixed(2)}`}</td>
                    <td className="py-2 pr-4">{d.category.name}</td>
                    <td className="py-2 pr-4">{d.startsAt ? new Date(d.startsAt).toLocaleString() : '—'}</td>
                    <td className="py-2 pr-4">{d.endsAt ? new Date(d.endsAt).toLocaleString() : '—'}</td>
                    <td className="py-2 pr-4">{d.items.length}</td>
                    <td className="py-2 pr-4">{d.active ? 'Active' : 'Inactive'}</td>
                    <td className="py-2 pr-4 text-right">
                      <div className="inline-flex gap-2">
                        <EditDiscountButton
                          discount={{
                            id: d.id,
                            name: d.name,
                            type: d.type,
                            value: Number(d.value),
                            categoryId: d.category.id,
                            startsAt: d.startsAt ? new Date(d.startsAt).toISOString() : null,
                            endsAt: d.endsAt ? new Date(d.endsAt).toISOString() : null,
                            active: Boolean(d.active),
                          }}
                          categories={simpleCategories}
                        />
                        <DeleteDiscountButton id={d.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {discounts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-muted-foreground text-center">No discounts yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
