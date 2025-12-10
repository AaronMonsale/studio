import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { listMenu, createCategory, createMenuItem } from "@/lib/admin-actions";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { DeleteMenuItemButton } from "@/components/admin/delete-menu-item-button";
import { EditCategoryButton } from "@/components/admin/edit-category-button";
import { EditMenuItemButton } from "@/components/admin/edit-menu-item-button";

export default async function MenuPage() {
    const categories = await listMenu();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Menu Management</h1>
                    <p className="text-muted-foreground">Organize your menu by creating categories and adding food items.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Create Category</CardTitle>
                    <CardDescription>Add a new menu category.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={createCategory} className="grid gap-4 max-w-xl">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Category Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Desserts" className="col-span-3" />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Create Category</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Menu Categories</CardTitle>
                    <CardDescription>Manage your food items within their respective categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {categories.map((category) => (
                            <AccordionItem value={category.id} key={category.id}>
                                <AccordionTrigger className="text-lg font-medium">
                                    {category.name}
                                </AccordionTrigger>
                                <div className="flex justify-end gap-2 pr-2 pb-2">
                                    <EditCategoryButton categoryId={category.id} name={category.name} />
                                    <DeleteCategoryButton categoryId={category.id} />
                                </div>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        {category.items.length > 0 ? (
                                            <ul className="space-y-2">
                                                {category.items.map(item => (
                                                    <li key={item.id} className="flex justify-between items-center p-2 rounded-md border">
                                                        <div>
                                                            <p className="font-semibold">{item.name}</p>
                                                            {item.description ? (
                                                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                                            ) : null}
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <p className="font-bold">${Number(item.price).toFixed(2)}</p>
                                                            <div className="flex items-center gap-2">
                                                                <EditMenuItemButton item={{ id: item.id, name: item.name, price: Number(item.price), description: item.description ?? '' }} />
                                                                <DeleteMenuItemButton itemId={item.id} />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-center p-4">No items in this category yet.</p>
                                        )}
                                        <form action={createMenuItem} className="grid gap-3 border rounded-md p-3">
                                            <input type="hidden" name="categoryId" value={category.id} />
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`name-${category.id}`} className="text-right">Name</Label>
                                                <Input id={`name-${category.id}`} name="name" placeholder="e.g., Chocolate Cake" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`price-${category.id}`} className="text-right">Price</Label>
                                                <Input id={`price-${category.id}`} name="price" type="number" step="0.01" placeholder="e.g., 7.50" className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`desc-${category.id}`} className="text-right">Description</Label>
                                                <Textarea id={`desc-${category.id}`} name="description" placeholder="A brief description of the item" className="col-span-3" />
                                            </div>
                                            <div className="flex justify-end">
                                                <Button type="submit">Add Item</Button>
                                            </div>
                                        </form>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}