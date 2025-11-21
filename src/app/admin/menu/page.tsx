'use client';
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type FoodItem = {
    name: string;
    price: number;
    description: string;
};

type Category = {
    name: string;
    items: FoodItem[];
};

const initialCategories: Category[] = [
    {
        name: 'Appetizers',
        items: [
            { name: 'Spring Rolls', price: 5.99, description: 'Crispy rolls with vegetable filling.' },
            { name: 'Garlic Bread', price: 4.50, description: 'Toasted bread with garlic butter.' },
        ]
    },
    {
        name: 'Main Courses',
        items: [
            { name: 'Classic Burger', price: 12.99, description: 'Beef patty with lettuce, tomato, and cheese.' },
            { name: 'Margherita Pizza', price: 14.00, description: 'Classic pizza with tomato, mozzarella, and basil.' },
        ]
    }
];

export default function MenuPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isFoodItemDialogOpen, setIsFoodItemDialogOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Menu Management</h1>
                    <p className="text-muted-foreground">Organize your menu by creating categories and adding food items.</p>
                </div>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-4 w-4" />Add Category</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                            <DialogDescription>
                                Enter a name for the new food category.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="category-name" className="text-right">
                                    Category Name
                                </Label>
                                <Input id="category-name" placeholder="e.g., Desserts" className="col-span-3" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={() => setIsCategoryDialogOpen(false)}>Create Category</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Menu Categories</CardTitle>
                    <CardDescription>Manage your food items within their respective categories.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {categories.map((category) => (
                            <AccordionItem value={category.name} key={category.name}>
                                <AccordionTrigger className="text-lg font-medium">{category.name}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        {category.items.length > 0 ? (
                                            <ul className="space-y-2">
                                                {category.items.map(item => (
                                                    <li key={item.name} className="flex justify-between items-center p-2 rounded-md border">
                                                        <div>
                                                            <p className="font-semibold">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                                        </div>
                                                        <p className="font-bold">${item.price.toFixed(2)}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted-foreground text-center p-4">No items in this category yet.</p>
                                        )}
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setActiveCategory(category.name);
                                            setIsFoodItemDialogOpen(true);
                                        }}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Add Food Item
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            <Dialog open={isFoodItemDialogOpen} onOpenChange={setIsFoodItemDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Food Item to {activeCategory}</DialogTitle>
                        <DialogDescription>
                            Fill in the details for the new food item.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="item-name" className="text-right">Name</Label>
                            <Input id="item-name" placeholder="e.g., Chocolate Cake" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="item-price" className="text-right">Price</Label>
                            <Input id="item-price" type="number" placeholder="e.g., 7.50" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="item-description" className="text-right">Description</Label>
                            <Textarea id="item-description" placeholder="A brief description of the item" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={() => setIsFoodItemDialogOpen(false)}>Add Item</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
